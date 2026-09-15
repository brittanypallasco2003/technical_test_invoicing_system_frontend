import type { IdentificationType, Status } from "./common";

/** Where the document stands with the SRI. */
export const InvoiceStatus = {
  DRAFT: "DRAFT",
  QUEUED: "QUEUED",
  PROCESSING: "PROCESSING",
  AUTHORIZED: "AUTHORIZED",
  REJECTED: "REJECTED",
} as const;
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

/** Table 24 of the SRI. */
export const PaymentMethod = {
  WITHOUT_FINANCIAL_SYSTEM: "01",
  DEBT_COMPENSATION: "15",
  DEBIT_CARD: "16",
  ELECTRONIC_MONEY: "17",
  PREPAID_CARD: "18",
  CREDIT_CARD: "19",
  WITH_FINANCIAL_SYSTEM: "20",
  ENDORSEMENT_OF_SECURITIES: "21",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

/** `InvoiceItemResponseDto` */
export interface InvoiceItem {
  id: string;
  productId: string;
  mainCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPriceWithoutTax: number;
  taxCode: string;
  taxPercentageCode: string;
  taxRate: number;
  taxableBase: number;
  taxAmount: number;
}

/** `InvoiceResponseDto` */
export interface Invoice {
  id: string;
  /** `001-001-000000042` */
  number: string;
  /** 49 digits, computed server-side. */
  accessKey: string;
  /** `YYYY-MM-DD`, in the issuer's timezone. */
  issueDate: string;
  establishmentCode: string;
  issuePointCode: string;
  sequential: string;
  buyerIdentificationType: IdentificationType;
  buyerIdentification: string;
  buyerBusinessName: string;
  buyerAddress: string | null;
  totalWithoutTaxes: number;
  totalDiscount: number;
  totalVat: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  invoiceStatus: InvoiceStatus;
  status: Status;
  items: InvoiceItem[];
}

/**
 * The fields the invoice listing shows.
 *
 * The API has no listing endpoint yet; this is the shape the table expects so
 * the endpoint can be added without touching the UI.
 */
export type InvoiceSummary = Pick<
  Invoice,
  | "id"
  | "number"
  | "issueDate"
  | "buyerBusinessName"
  | "totalAmount"
  | "invoiceStatus"
>;

/** `CreateInvoiceItemDto` */
export interface CreateInvoiceItemPayload {
  productId: string;
  quantity: number;
}

/** `CreateInvoiceDto`: prices, taxes and totals are computed by the server. */
export interface CreateInvoicePayload {
  customerId: string;
  issuePointId: string;
  paymentMethod: PaymentMethod;
  items: CreateInvoiceItemPayload[];
}
