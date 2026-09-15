import type { EstablishmentDetail } from "@/types/establishment";

export const establishmentsMock: EstablishmentDetail[] = [
  {
    id: "7d0c1a3e-4f0b-4c52-9b7e-1f6a2c3d4e01",
    code: "001",
    name: "Matriz Quito",
    address: "Av. Amazonas N34-120 y Av. República",
    status: "ACTIVE",
    issuePoints: [
      { id: "b1f2c3d4-0001-4a6b-8c9d-0e1f2a3b4c01", code: "001", description: "Caja principal", lastSequential: 42, status: "ACTIVE" },
      { id: "b1f2c3d4-0002-4a6b-8c9d-0e1f2a3b4c02", code: "002", description: "Ventas en línea", lastSequential: 0, status: "INACTIVE" },
    ],
  },
  {
    id: "7d0c1a3e-4f0b-4c52-9b7e-1f6a2c3d4e02",
    code: "002",
    name: "Sucursal Guayaquil",
    address: "Av. 9 de Octubre 1215 y García Avilés",
    status: "ACTIVE",
    issuePoints: [
      { id: "b1f2c3d4-0003-4a6b-8c9d-0e1f2a3b4c03", code: "001", description: "Caja principal", lastSequential: 17, status: "ACTIVE" },
    ],
  },
  {
    id: "7d0c1a3e-4f0b-4c52-9b7e-1f6a2c3d4e03",
    code: "003",
    name: "Sucursal Cuenca",
    address: "Calle Larga 7-45 y Benigno Malo",
    status: "INACTIVE",
    issuePoints: [
      { id: "b1f2c3d4-0004-4a6b-8c9d-0e1f2a3b4c04", code: "001", description: "Caja principal", lastSequential: 0, status: "INACTIVE" },
    ],
  },
];
