import type { Status } from "./common";
import type { Tax } from "./tax";

/** `ProductResponseDto` */
export interface Product {
  id: string;
  mainCode: string;
  auxiliaryCode: string | null;
  name: string;
  /** Text printed on the invoice line. */
  description: string;
  unitPrice: number;
  stock: number;
  status: Status;
  tax: Tax;
}
