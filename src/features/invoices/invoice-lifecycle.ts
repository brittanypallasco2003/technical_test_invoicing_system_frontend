import { InvoiceStatus } from "@/types/invoice";

/**
 * The states where the document is not final: it can still be corrected, and it
 * can still be discarded. Mirrors `AMENDABLE` in the API.
 *
 * DRAFT is listed and is today unreachable -- issuing writes QUEUED directly --
 * for the same reason the API lists it: the day drafts are saved, both actions
 * already cover them.
 */
const AMENDABLE: InvoiceStatus[] = [InvoiceStatus.DRAFT, InvoiceStatus.REJECTED];

/**
 * Whether the invoice can still be corrected or discarded.
 *
 * Hiding both actions in the other states says what the API would answer
 * anyway: an in-flight document has to be waited for, and an authorized one is
 * voided by a separate fiscal process, never edited or deleted.
 */
export function isAmendable(status: InvoiceStatus): boolean {
  return AMENDABLE.includes(status);
}
