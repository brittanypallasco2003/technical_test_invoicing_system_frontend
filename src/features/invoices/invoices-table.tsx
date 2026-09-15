"use client";

import { Suspense } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DetailSkeleton } from "@/components/ui/detail";
import { SlideOver } from "@/components/ui/dialog";
import { InvoiceStatusBadge } from "@/features/shared/status-badges";
import { useRecordDetail } from "@/hooks/use-record-detail";
import { formatCurrency, formatIsoDate } from "@/lib/format";
import { getInvoice } from "@/services/invoices";
import type { InvoiceSummary } from "@/types/invoice";
import { InvoiceDetailView } from "./invoice-detail";

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
  const { selection, open, close } = useRecordDetail((invoice: InvoiceSummary) =>
    getInvoice(invoice.id),
  );

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
            <InvoiceDetailView detail={selection.detail} />
          </Suspense>
        </SlideOver>
      )}
    </>
  );
}
