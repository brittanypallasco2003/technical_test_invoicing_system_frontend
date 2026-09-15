import type { Product } from "@/types/product";
import { taxesMock } from "./taxes";

const [iva15, iva0] = taxesMock;

export const productsMock: Product[] = [
  {
    id: "a1b2c3d4-0001-4e5f-8a9b-0c1d2e3f4a01",
    mainCode: "PRD-001",
    auxiliaryCode: "7861234500011",
    name: "Resma de papel bond A4",
    description: "Resma de 500 hojas, 75 g/m².",
    unitPrice: 4.5,
    stock: 120,
    status: "ACTIVE",
    tax: iva15,
  },
  {
    id: "a1b2c3d4-0002-4e5f-8a9b-0c1d2e3f4a02",
    mainCode: "PRD-002",
    auxiliaryCode: null,
    name: "Tóner HP 85A",
    description: "Cartucho de tóner negro original HP CE285A.",
    unitPrice: 68.9,
    stock: 14,
    status: "ACTIVE",
    tax: iva15,
  },
  {
    id: "a1b2c3d4-0003-4e5f-8a9b-0c1d2e3f4a03",
    mainCode: "PRD-003",
    auxiliaryCode: "9789978123456",
    name: "Libro de contabilidad general",
    description: "Libro de texto, 3.ª edición.",
    unitPrice: 12,
    stock: 30,
    status: "ACTIVE",
    tax: iva0,
  },
  {
    id: "a1b2c3d4-0004-4e5f-8a9b-0c1d2e3f4a04",
    mainCode: "PRD-004",
    auxiliaryCode: null,
    name: "Silla ergonómica ejecutiva",
    description: "Silla con soporte lumbar y apoyabrazos regulables.",
    unitPrice: 189,
    stock: 6,
    status: "ACTIVE",
    tax: iva15,
  },
  {
    id: "a1b2c3d4-0005-4e5f-8a9b-0c1d2e3f4a05",
    mainCode: "PRD-005",
    auxiliaryCode: null,
    name: "Calculadora financiera",
    description: "Calculadora financiera HP 10bII+.",
    unitPrice: 54,
    stock: 0,
    status: "INACTIVE",
    tax: iva15,
  },
];
