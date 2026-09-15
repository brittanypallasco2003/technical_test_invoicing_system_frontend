import type { Status } from "./common";

/** `EstablishmentResponseDto` */
export interface Establishment {
  id: string;
  /** 3-digit code, the `estab` field of the access key. */
  code: string;
  name: string;
  address: string;
  status: Status;
}

/** `IssuePointResponseDto` */
export interface IssuePoint {
  id: string;
  /** 3-digit code, the `ptoEmi` field of the access key. */
  code: string;
  description: string | null;
  lastSequential: number;
  status: Status;
}

/** `EstablishmentDetailResponseDto` */
export interface EstablishmentDetail extends Establishment {
  issuePoints: IssuePoint[];
}
