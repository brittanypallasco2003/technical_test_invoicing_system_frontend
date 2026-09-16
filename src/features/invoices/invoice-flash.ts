/** Query param the issuing form redirects with: `/facturas?emitida=001-001-000000047`. */
export const ISSUED_PARAM = "emitida";

/**
 * How long the listing waits before asking again.
 *
 * Issuing and correcting both answer with the invoice QUEUED: the SRI is
 * answered in the background, a couple of seconds later. Refreshing once after
 * that is what turns "En cola" into the outcome without the user reloading.
 */
export const RECHECK_DELAY_MS = 4000;

export function issuedHref(invoiceNumber: string): string {
  return `/facturas?${new URLSearchParams({ [ISSUED_PARAM]: invoiceNumber })}`;
}
