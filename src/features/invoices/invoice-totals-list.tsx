import { formatCurrency, formatQuantity } from "@/lib/format";
import type { InvoiceTotals } from "@/lib/invoice-totals";

/** Totals block in the order the SRI's printed invoice (RIDE) shows them. */
export function InvoiceTotalsList({ totals }: { totals: InvoiceTotals }) {
  const rows = [
    ...totals.breakdown.map((group) => ({
      label: `Subtotal ${formatQuantity(group.rate)} %`,
      value: group.taxableBase,
    })),
    { label: "Subtotal sin impuestos", value: totals.totalWithoutTaxes },
    ...(totals.totalDiscount > 0 ? [{ label: "Descuento", value: totals.totalDiscount }] : []),
    ...totals.breakdown
      .filter((group) => group.rate > 0)
      .map((group) => ({ label: `IVA ${formatQuantity(group.rate)} %`, value: group.taxAmount })),
  ];

  return (
    <dl className="flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between gap-4 text-sm text-paragraph">
          <dt>{row.label}</dt>
          <dd className="font-mono text-headline">{formatCurrency(row.value)}</dd>
        </div>
      ))}
      <div className="mt-1 flex items-baseline justify-between gap-4 border-t-[1.5px] border-stroke pt-3 text-headline">
        <dt className="font-bold">Total</dt>
        <dd className="font-mono text-xl font-bold">{formatCurrency(totals.totalAmount)}</dd>
      </div>
    </dl>
  );
}
