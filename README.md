# Facturador 593 · Frontend

Interfaz web para emitir y consultar comprobantes electrónicos bajo el esquema
del SRI de Ecuador. Consume la API REST de
[technical_test_generate_invoice_system](https://github.com/brittanypallasco2003/technical_test_generate_invoice_system).

Stack: Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4

## Requisitos previos

| Herramienta    | Versión         | Notas                                                                                  |
| -------------- | --------------- | -------------------------------------------------------------------------------------- |
| Node.js        | 20.9.0 o mayor  | Mínimo que exige Next.js 16. Verificado con Node 24.21.0.                              |
| Yarn           | 1.22.22         | Fijado en `packageManager`. npm está bloqueado por `engines` y `engine-strict` en `.npmrc`. |
| API (backend)  | —               | Tiene que estar corriendo, por defecto en `http://localhost:3000`.                     |
| PostgreSQL     | 14 o mayor      | Lo usa el backend, no este proyecto. Sirve una instalación local o Docker.            |
| Git            | —               | Para clonar los dos repositorios.                                                      |

Si no tienes Yarn 1:

```bash
npm install --global yarn@1.22.22
```

## Variables de entorno

El archivo [.env.example](.env.example) trae la única variable que usa el
proyecto:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3000
```

| Variable              | Obligatoria | Por defecto             | Descripción                                   |
| --------------------- | ----------- | ----------------------- | --------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | No          | `http://localhost:3000` | URL base de la API NestJS, sin barra final.   |

Se copia a `.env.local`, que está en `.gitignore`:

```bash
cp .env.example .env.local
```

> La variable se lee al arrancar `yarn dev` y al compilar con `yarn build`. Si
> la cambias, reinicia el servidor de desarrollo o vuelve a compilar.

## Puesta en marcha

Los pasos van en orden: el frontend no tiene datos propios, así que la API
tiene que estar arriba y con los datos de prueba cargados antes de abrirlo.

Los comandos funcionan igual en Git Bash, macOS/Linux y PowerShell.

### 1. Levantar la API y cargar los datos de prueba

Los datos de prueba viven en las migraciones del backend: la API no tiene
endpoints para crear impuestos, clientes, establecimientos ni productos.

```bash
git clone https://github.com/brittanypallasco2003/technical_test_generate_invoice_system.git
cd technical_test_generate_invoice_system
yarn install
cp .env.example .env
```

En ese `.env` hay que completar `SRI_RUC` (13 dígitos), `SRI_BUSINESS_NAME` y
`SRI_HEADQUARTERS_ADDRESS`; la API no arranca si faltan. El resto ya trae
valores que funcionan en local.

Crear la base de datos. Con Docker, usando los mismos valores del `.env.example`
del backend:

```bash
docker run -d --name invoicing-db -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=invoicing postgres:17
```

O con un PostgreSQL instalado en la máquina:

```bash
createdb -U postgres invoicing
```

Crear el esquema, cargar los datos de prueba y levantar la API:

```bash
yarn migration:run
yarn start:dev
```

`yarn migration:run` deja cargado:

| Datos             | Contenido                                                                  |
| ----------------- | -------------------------------------------------------------------------- |
| Impuestos         | IVA 0 %, 5 %, 15 %, no objeto de IVA y exento.                             |
| Establecimientos  | `001` Matriz Quito (puntos `001` y `002`) y `002` Sucursal Guayaquil (`001`). |
| Clientes          | 4 activos (cédula, RUC, pasaporte y consumidor final) y 1 inactivo.        |
| Productos         | 5 activos con IVA 15 %, 5 % y 0 %, uno con solo 2 unidades, y 1 inactivo.  |

La API queda en `http://localhost:3000`. El detalle de sus variables y
migraciones está en el
[README del backend](https://github.com/brittanypallasco2003/technical_test_generate_invoice_system#readme).

### 2. Instalar las dependencias del frontend

En otra terminal:

```bash
git clone https://github.com/brittanypallasco2003/technical_test_invoicing_system_frontend.git
cd technical_test_invoicing_system_frontend
yarn install
```

### 3. Configurar las variables de entorno

```bash
cp .env.example .env.local
```

Si la API corre en otro host o puerto, edita `NEXT_PUBLIC_API_URL`.

### 4. Levantar el proyecto

```bash
yarn dev
```

Abrir [http://localhost:3001](http://localhost:3001): la raíz redirige a
`/facturas`. El puerto está fijado en 3001 porque la API ocupa el 3000.

Si una página muestra "No se pudo cargar la información", la API no está
respondiendo en `NEXT_PUBLIC_API_URL`.

Para probar la versión de producción:

```bash
yarn build
yarn start
```

### Scripts

| Comando      | Qué hace                                             |
| ------------ | ---------------------------------------------------- |
| `yarn dev`   | Servidor de desarrollo en el puerto 3001.            |
| `yarn build` | Compilación de producción.                           |
| `yarn start` | Sirve la compilación de producción en el puerto 3001. |
| `yarn lint`  | ESLint con la configuración de Next.                 |

## Organización de la solución

### Estructura

```text
src/
├── app/
│   ├── layout.tsx           layout raíz: fuentes, metadatos, idioma
│   └── (dashboard)/         secciones con navbar y sidebar compartidos
│       ├── layout.tsx
│       ├── error.tsx        error de carga, con reintento, dentro del layout
│       ├── impuestos/
│       ├── establecimientos/
│       ├── clientes/
│       ├── productos/
│       └── facturas/        listado y facturas/nueva
├── components/
│   ├── layout/              app shell, navbar, sidebar y menú
│   └── ui/                  piezas genéricas: tabla, modal, toast, formularios, badges
├── features/                lógica y componentes de cada dominio
│   ├── taxes/
│   ├── establishments/
│   ├── customers/           tabla, buscador con autocompletado
│   ├── products/
│   ├── invoices/            formulario, detalle, corrección, borrado, XML
│   └── shared/              badges de estado
├── services/                un archivo por recurso de la API, sobre api-client.ts
├── types/                   tipos que reflejan los DTO de la API
├── hooks/                   hooks reutilizables (media query, modal, detalle)
└── lib/                     funciones puras: formato, totales, etiquetas
```

### Decisiones

- **Capas separadas.** `app/` solo arma páginas, `features/` tiene la lógica de
  cada dominio, `components/ui/` no sabe nada de facturas, `services/` es el
  único lugar que habla con la API y `lib/` son funciones puras.
- **Datos desde el servidor.** Cada `page.tsx` es un Server Component que pide
  sus datos a `services/`; solo lo interactivo (tablas con detalle, formularios,
  menú) es Client Component. Las peticiones usan `cache: "no-store"` porque los
  datos cambian en la base, no en cada despliegue.
- **Proxy hacia la API.** La API no habilita CORS. El servidor de Next la llama
  directo y el navegador usa `/api/*`, que `next.config.ts` reescribe hacia
  `NEXT_PUBLIC_API_URL`.
- **Errores legibles.** `api-client.ts` convierte las respuestas fallidas en
  `ApiError` con el `message` de Nest, así que un 409 (sin stock, factura ya
  autorizada) llega al usuario con el motivo real. Si una página no carga,
  `error.tsx` muestra el aviso sin romper la navegación.
- **Detalle bajo demanda.** Al elegir una fila, la petición del detalle empieza
  en el clic y el panel lateral la espera con `use()` y `Suspense`.

### Flujo de facturas

- **Emitir** (`/facturas/nueva`): solo ofrece establecimientos y productos
  activos; los puntos de emisión se cargan al elegir el establecimiento.
- **Buscar clientes**: no se carga el directorio completo. El combobox busca por
  razón social desde 2 caracteres, con debounce de 300 ms, reutiliza respuestas
  anteriores para filtrar en el navegador y cancela las búsquedas que quedaron
  atrás.
- **Stock**: cada línea consulta la disponibilidad del producto (debounce de
  400 ms) y avisa antes de enviar. Es solo un aviso: quien garantiza el stock es
  la API al emitir.
- **Totales**: el formulario calcula una vista previa agrupada por tarifa de IVA.
  Los totales definitivos son los que devuelve la API.
- **Autorización asíncrona**: la API responde con la factura `En cola` y la
  autoriza en segundo plano. El formulario redirige al listado, muestra un aviso
  y refresca una vez a los 4 segundos para mostrar el resultado del SRI.
- **Corregir y eliminar**: solo aparecen para facturas rechazadas, igual que la
  regla del backend. Corregir permite cambiar cliente y forma de pago y reenvía
  la factura; eliminar es un borrado lógico.
- **XML**: se puede ver en un modal, copiar o descargar con el nombre que
  asigna la API.
