import { invoicesMock } from "@/mocks/invoices";
import type { CreateInvoicePayload, Invoice, InvoiceSummary } from "@/types/invoice";
import { mockResponse, NotFoundError } from "./mock-response";

/**
 * Invoice listing.
 *
 * The API does not expose `GET /invoices` yet (only `GET /invoices/:id`).
 */
export function listInvoices(): Promise<InvoiceSummary[]> {
  return mockResponse(
    invoicesMock.map(
      ({ id, number, issueDate, buyerBusinessName, totalAmount, invoiceStatus }) => ({
        id,
        number,
        issueDate,
        buyerBusinessName,
        totalAmount,
        invoiceStatus,
      }),
    ),
  );
}

/** `GET /invoices/:id` */
export async function getInvoice(id: string): Promise<Invoice> {
  const invoice = invoicesMock.find((candidate) => candidate.id === id);
  if (!invoice) throw new NotFoundError("Invoice", id);
  return mockResponse(invoice);
}

/**
 * `POST /invoices`
 *
 * Not persisted while the API is not wired: the payload is validated by the
 * form and echoed back.
 */
export function createInvoice(payload: CreateInvoicePayload): Promise<CreateInvoicePayload> {
  return mockResponse(payload);
}
