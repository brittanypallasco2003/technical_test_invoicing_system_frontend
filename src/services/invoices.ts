import { API_PROXY_PATH } from "@/lib/api-config";
import type { CreateInvoicePayload, Invoice, InvoiceSummary } from "@/types/invoice";
import { apiGet, apiPost } from "./api-client";

/** `GET /invoices` -- every issued document, newest first, without its lines. */
export function listInvoices(): Promise<InvoiceSummary[]> {
  return apiGet<InvoiceSummary[]>("/invoices");
}

/** `GET /invoices/:id` */
export function getInvoice(id: string): Promise<Invoice> {
  return apiGet<Invoice>(`/invoices/${encodeURIComponent(id)}`);
}

/**
 * `POST /invoices`
 *
 * Answers as soon as the invoice is committed, with `invoiceStatus` QUEUED: the
 * SRI authorization runs afterwards, in the background, and `getInvoice` is how
 * the client finds out how it ended.
 */
export function createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
  return apiPost<Invoice>("/invoices", payload);
}

/**
 * `GET /invoices/:id/xml`
 *
 * A URL and not a request: the response is a file with a `Content-Disposition`
 * of its own, so the browser downloads it from a link instead of the app
 * fetching the XML into memory only to hand it back.
 */
export function invoiceXmlUrl(id: string): string {
  return `${API_PROXY_PATH}/invoices/${encodeURIComponent(id)}/xml`;
}
