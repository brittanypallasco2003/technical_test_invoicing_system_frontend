import { roundCurrency } from "./format";

export interface TaxableLine {
  quantity: number;
  unitPrice: number;
  discount?: number;
  taxRate: number;
}

export interface TaxBreakdown {
  rate: number;
  taxableBase: number;
  taxAmount: number;
}

export interface InvoiceTotals {
  breakdown: TaxBreakdown[];
  totalWithoutTaxes: number;
  totalDiscount: number;
  totalVat: number;
  totalAmount: number;
}

/** Groups lines the server already computed by rate, highest rate first. */
export function groupTaxBreakdown(
  items: Array<Pick<TaxBreakdown, "taxableBase" | "taxAmount"> & { taxRate: number }>,
): TaxBreakdown[] {
  const groups = new Map<number, TaxBreakdown>();

  for (const item of items) {
    const group = groups.get(item.taxRate) ?? { rate: item.taxRate, taxableBase: 0, taxAmount: 0 };
    group.taxableBase = roundCurrency(group.taxableBase + item.taxableBase);
    group.taxAmount = roundCurrency(group.taxAmount + item.taxAmount);
    groups.set(item.taxRate, group);
  }

  return [...groups.values()].sort((groupA, groupB) => groupB.rate - groupA.rate);
}

export function calculateLineSubtotal(line: TaxableLine): number {
  return roundCurrency(line.quantity * line.unitPrice - (line.discount ?? 0));
}

/**
 * Groups the lines by tax rate and adds up the totals.
 *
 * The server is the source of truth for an issued invoice; the UI uses this
 * only to preview the amounts while the form is being filled in.
 */
export function calculateInvoiceTotals(lines: TaxableLine[]): InvoiceTotals {
  const baseByRate = new Map<number, number>();
  let totalDiscount = 0;

  for (const line of lines) {
    const subtotal = calculateLineSubtotal(line);
    baseByRate.set(line.taxRate, (baseByRate.get(line.taxRate) ?? 0) + subtotal);
    totalDiscount += line.discount ?? 0;
  }

  const breakdown = [...baseByRate.entries()]
    .sort(([rateA], [rateB]) => rateB - rateA)
    .map(([rate, base]) => ({
      rate,
      taxableBase: roundCurrency(base),
      taxAmount: roundCurrency((base * rate) / 100),
    }));

  const totalWithoutTaxes = roundCurrency(
    breakdown.reduce((sum, group) => sum + group.taxableBase, 0),
  );
  const totalVat = roundCurrency(
    breakdown.reduce((sum, group) => sum + group.taxAmount, 0),
  );

  return {
    breakdown,
    totalWithoutTaxes,
    totalDiscount: roundCurrency(totalDiscount),
    totalVat,
    totalAmount: roundCurrency(totalWithoutTaxes + totalVat),
  };
}
