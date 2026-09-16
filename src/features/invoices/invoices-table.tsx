"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DetailSkeleton } from "@/components/ui/detail";
import { SlideOver } from "@/components/ui/dialog";
import { Toast } from "@/components/ui/toast";
import { InvoiceStatusBadge } from "@/features/shared/status-badges";
import { useRecordDetail } from "@/hooks/use-record-detail";
import { formatCurrency, formatIsoDate } from "@/lib/format";
import { getInvoice } from "@/services/invoices";
import type { InvoiceSummary } from "@/types/invoice";
import { InvoiceDetailView } from "./invoice-detail";
import { ISSUED_PARAM, RECHECK_DELAY_MS } from "./invoice-flash";

interface Flash {
  title: string;
  description?: string;
}

const columns: DataTableColumn<InvoiceSummary>[] = [
  { id: "number", header: "Número", cell: (invoice) => invoice.number, mono: true },
  { id: "issueDate", header: "Fecha", cell: (invoice) => formatIsoDate(invoice.issueDate), mono: true },
  { id: "buyer", header: "Cliente", cell: (invoice) => invoice.buyerBusinessName, emphasis: true },
  {
    id: "totalAmount",
    header: "Total",
    cell: (invoice) => formatCurrency(invoice.totalAmount),
    align: "right",
    mono: true,
  },
  {
    id: "invoiceStatus",
    header: "Estado SRI",
    cell: (invoice) => <InvoiceStatusBadge status={invoice.invoiceStatus} />,
  },
];

export function InvoicesTable({ invoices }: { invoices: InvoiceSummary[] }) {
  const router = useRouter();
  const issuedNumber = useSearchParams().get(ISSUED_PARAM);
  const { selection, open, close } = useRecordDetail((invoice: InvoiceSummary) =>
    getInvoice(invoice.id),
  );

  const [localFlash, setLocalFlash] = useState<Flash | null>(null);
  /** Changing this schedules one more refresh; its value is never read. */
  const [recheckKey, setRecheckKey] = useState<string | number | null>(null);

  // The issuing form lands here with the number it just wrote, because this is
  // the screen where the status it announces will show up.
  const flash: Flash | null =
    localFlash ??
    (issuedNumber
      ? {
          title: `Factura ${issuedNumber} emitida`,
          description: "Se está enviando al SRI; el estado se actualiza en unos segundos.",
        }
      : null);

  const pendingRecheck = recheckKey ?? issuedNumber;

  useEffect(() => {
    if (!pendingRecheck) return;

    const timer = setTimeout(() => router.refresh(), RECHECK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pendingRecheck, router]);

  const dismissFlash = useCallback(() => {
    setLocalFlash(null);
    // Drops `?emitida=` so a reload does not announce the same invoice again.
    if (window.location.search) router.replace("/facturas", { scroll: false });
  }, [router]);

  /**
   * A corrected invoice goes back to QUEUED and is resent, so the panel would
   * keep showing the version that was just replaced. Refreshing now puts it in
   * the listing, and the scheduled refresh shows how the SRI answered.
   */
  function handleCorrected() {
    const number = selection?.row.number;
    close();
    setLocalFlash({
      title: `Factura ${number} corregida`,
      description: "Se está reenviando al SRI; el estado se actualiza en unos segundos.",
    });
    setRecheckKey(Date.now());
    router.refresh();
  }

  function handleDeleted() {
    const number = selection?.row.number;
    close();
    setLocalFlash({ title: `Factura ${number} eliminada`, description: "Ya no aparece en el listado." });
    router.refresh();
  }

  return (
    <>
      <DataTable
        caption="Facturas"
        columns={columns}
        rows={invoices}
        getRowId={(invoice) => invoice.id}
        getRowLabel={(invoice) => `la factura ${invoice.number}`}
        onRowSelect={open}
        selectedRowId={selection?.row.id}
        emptyMessage="Todavía no se han emitido facturas."
      />
      {selection && (
        <SlideOver
          open
          onClose={close}
          eyebrow="Factura"
          title={selection.row.number}
          meta={<InvoiceStatusBadge status={selection.row.invoiceStatus} />}
        >
          <Suspense fallback={<DetailSkeleton />}>
            <InvoiceDetailView
              detail={selection.detail}
              onCorrected={handleCorrected}
              onDeleted={handleDeleted}
            />
          </Suspense>
        </SlideOver>
      )}
      {flash && <Toast {...flash} onDismiss={dismissFlash} />}
    </>
  );
}
