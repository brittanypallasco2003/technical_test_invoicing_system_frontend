import type { IdentificationType, Status } from "@/types/common";
import type { InvoiceStatus, PaymentMethod } from "@/types/invoice";

export const STATUS_LABELS: Record<Status, string> = {
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
};

export const IDENTIFICATION_TYPE_LABELS: Record<IdentificationType, string> = {
  "04": "RUC",
  "05": "Cédula",
  "06": "Pasaporte",
  "07": "Consumidor final",
  "08": "Identificación del exterior",
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: "Borrador",
  QUEUED: "En cola",
  PROCESSING: "En proceso",
  AUTHORIZED: "Autorizada",
  REJECTED: "Rechazada",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  "01": "Sin utilización del sistema financiero",
  "15": "Compensación de deudas",
  "16": "Tarjeta de débito",
  "17": "Dinero electrónico",
  "18": "Tarjeta prepago",
  "19": "Tarjeta de crédito",
  "20": "Otros con utilización del sistema financiero",
  "21": "Endoso de títulos",
};

/** Table 16 of the SRI. */
export const TAX_CODE_LABELS: Record<string, string> = {
  "2": "IVA",
  "3": "ICE",
  "5": "IRBPNR",
};
