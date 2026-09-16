const LOCALE = "es-EC";
const ISSUER_TIME_ZONE = "America/Guayaquil";

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "USD",
});

const rateFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const quantityFormatter = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: 6,
});

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: ISSUER_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timestampFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: ISSUER_TIME_ZONE,
  dateStyle: "short",
  timeStyle: "short",
});

/** `1254.3` → `$1.254,30` */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** `15` → `15,00 %` */
export function formatRate(rate: number): string {
  return `${rateFormatter.format(rate)} %`;
}

export function formatQuantity(value: number): string {
  return quantityFormatter.format(value);
}

/**
 * `2026-09-14` → `14/09/2026`.
 *
 * Splits the string instead of going through `Date`, which would read the
 * value as UTC midnight and can shift it a day back in Ecuador.
 */
export function formatIsoDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * An instant the API returns, read in the issuer's timezone rather than the
 * browser's: an authorization stamped at 23:30 in Ecuador is not tomorrow.
 */
export function formatTimestamp(isoTimestamp: string): string {
  return timestampFormatter.format(new Date(isoTimestamp));
}

/** Today's date as the issuer sees it, whatever the browser's timezone. */
export function formatToday(): string {
  return dateFormatter.format(new Date());
}

/** `42` → `000000042` */
export function formatSequential(value: number): string {
  return String(value).padStart(9, "0");
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
