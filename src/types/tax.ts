import type { Status } from "./common";

/** `TaxResponseDto` */
export interface Tax {
  id: number;
  /** Table 16 of the SRI: 2 = IVA, 3 = ICE, 5 = IRBPNR. */
  code: string;
  /** Table 18 of the SRI: 4 = 15 %, 0 = 0 %, 6 = No objeto, 7 = Exento. */
  percentageCode: string;
  name: string;
  /** Percentage, e.g. `15` for 15 %. */
  rate: number;
  status: Status;
}
