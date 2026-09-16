import { API_PROXY_PATH } from "@/lib/api-config";
import type { CreateInvoicePayload, Invoice, InvoiceSummary } from "@/types/invoice";
import { apiGet, apiGetText, apiPost } from "./api-client";

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
 * `GET /invoices/:id/xml`, as text to display.
 *
 * The endpoint sends `Content-Disposition: attachment`, so pointing a tab at it
 * downloads the file instead of showing it. Reading the body here is what lets
 * the app render the document on screen.
 */
export function getInvoiceXml(id: string, signal?: AbortSignal): Promise<string> {
  return apiGetText(`/invoices/${encodeURIComponent(id)}/xml`, signal);
}

/**
 * The same endpoint as a URL, for the download link.
 *
 * A link and not a request: the response already carries the filename the SRI
 * convention wants, so the browser does the saving.
 */
export function invoiceXmlUrl(id: string): string {
  return `${API_PROXY_PATH}/invoices/${encodeURIComponent(id)}/xml`;
}
