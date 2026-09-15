import type { CustomerDetail } from "@/types/customer";

export const customersMock: CustomerDetail[] = [
  {
    id: "c0a80101-0001-4b2c-9d3e-4f5a6b7c8d01",
    identificationType: "04",
    identification: "1790012345001",
    businessName: "Distribuidora Andina S.A.",
    email: "compras@andina.ec",
    address: "Av. Galo Plaza Lasso N47-15, Quito",
    status: "ACTIVE",
  },
  {
    id: "c0a80101-0002-4b2c-9d3e-4f5a6b7c8d02",
    identificationType: "05",
    identification: "1712345678",
    businessName: "María Fernanda López",
    email: "mf.lopez@correo.ec",
    address: "Calle Los Pinos E5-23, Quito",
    status: "ACTIVE",
  },
  {
    id: "c0a80101-0003-4b2c-9d3e-4f5a6b7c8d03",
    identificationType: "06",
    identification: "A1234567",
    businessName: "John Carter",
    email: "jcarter@correo.com",
    address: "Av. 6 de Diciembre N25-40, Quito",
    status: "ACTIVE",
  },
  {
    id: "c0a80101-0004-4b2c-9d3e-4f5a6b7c8d04",
    identificationType: "07",
    identification: "9999999999999",
    businessName: "Consumidor Final",
    email: null,
    address: null,
    status: "ACTIVE",
  },
  {
    id: "c0a80101-0005-4b2c-9d3e-4f5a6b7c8d05",
    identificationType: "04",
    identification: "0992345678001",
    businessName: "Comercial Costa Azul Cía. Ltda.",
    email: "facturacion@costaazul.ec",
    address: "Av. Francisco de Orellana 234, Guayaquil",
    status: "INACTIVE",
  },
];
