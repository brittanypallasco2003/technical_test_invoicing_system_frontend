import type { IdentificationType, Status } from "./common";

/** `CustomerResponseDto` */
export interface Customer {
  id: string;
  identificationType: IdentificationType;
  identification: string;
  businessName: string;
  email: string | null;
  status: Status;
}

/** `CustomerDetailResponseDto` */
export interface CustomerDetail extends Customer {
  address: string | null;
}
