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

/** `UnavailabilityReason` */
export type UnavailabilityReason = "INSUFFICIENT_STOCK" | "NOT_ACTIVE";

/** `ProductAvailabilityResponseDto` */
export interface ProductAvailability {
  productId: string;
  /** Quantity the caller asked about. */
  requested: number;
  stock: number;
  status: Status;
  /** `true` only when the product is ACTIVE and the stock covers `requested`. */
  available: boolean;
  reason: UnavailabilityReason | null;
}
