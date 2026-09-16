import { API_PROXY_PATH } from "@/lib/api-config";
import type {
  CreateInvoicePayload,
  Invoice,
  InvoiceSummary,
  UpdateInvoicePayload,
} from "@/types/invoice";
import { apiDelete, apiGet, apiGetText, apiPatch, apiPost } from "./api-client";

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
 * `PATCH /invoices/:id`
 *
 * Corrects a rejected invoice and sends it again: the answer comes back in
 * QUEUED, like issuing. 409 when the document is past correcting -- already
 * authorized, or still on its way to the SRI.
 */
export function updateInvoice(id: string, payload: UpdateInvoicePayload): Promise<Invoice> {
  return apiPatch<Invoice>(`/invoices/${encodeURIComponent(id)}`, payload);
}

/**
 * `DELETE /invoices/:id`
 *
 * Discards an invoice that never became a document, and answers 204. It is not
 * anulación: an authorized comprobante is voided through a separate fiscal
 * process, and the API refuses this with a 409. The deletion is logical, so the
 * number stays consumed -- the SRI expects gapless numbering.
 */
export function deleteInvoice(id: string): Promise<void> {
  return apiDelete(`/invoices/${encodeURIComponent(id)}`);
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
