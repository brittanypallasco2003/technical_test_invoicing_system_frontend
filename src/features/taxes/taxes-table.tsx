"use client";

import { Suspense, use } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DescriptionList, DetailSkeleton } from "@/components/ui/detail";
import { Modal } from "@/components/ui/dialog";
import { RecordStatusBadge } from "@/features/shared/status-badges";
import { useRecordDetail } from "@/hooks/use-record-detail";
import { formatRate } from "@/lib/format";
import { TAX_CODE_LABELS } from "@/lib/labels";
import { getTax } from "@/services/taxes";
import type { Tax } from "@/types/tax";

const columns: DataTableColumn<Tax>[] = [
  { id: "code", header: "Código", cell: (tax) => tax.code, mono: true },
  { id: "percentageCode", header: "Cód. porcentaje", cell: (tax) => tax.percentageCode, mono: true },
  { id: "name", header: "Nombre", cell: (tax) => tax.name, emphasis: true },
  { id: "rate", header: "Tarifa", cell: (tax) => formatRate(tax.rate), align: "right", mono: true },
  { id: "status", header: "Estado", cell: (tax) => <RecordStatusBadge status={tax.status} /> },
];

/**
 * `GET /taxes/:id` answers the same DTO as the listing, so this adds no field.
 * What it adds is freshness: a rate the catalogue changed after the page was
 * rendered is what the modal shows.
 */
function TaxDetailView({ detail }: { detail: Promise<Tax> }) {
  const tax = use(detail);

  return (
    <DescriptionList
      items={[
        { label: "Impuesto", value: `${tax.code} · ${TAX_CODE_LABELS[tax.code] ?? "Otro"}` },
        { label: "Código de porcentaje", value: tax.percentageCode, mono: true },
        { label: "Tarifa", value: formatRate(tax.rate), mono: true },
      ]}
    />
  );
}

export function TaxesTable({ taxes }: { taxes: Tax[] }) {
  const { selection, open, close } = useRecordDetail((tax: Tax) => getTax(tax.id));

  return (
    <>
      <DataTable
        caption="Impuestos"
        columns={columns}
        rows={taxes}
        getRowId={(tax) => String(tax.id)}
        getRowLabel={(tax) => tax.name}
        onRowSelect={open}
        selectedRowId={selection ? String(selection.row.id) : null}
        emptyMessage="No hay impuestos registrados."
      />
      {selection && (
        <Modal
          open
          onClose={close}
          eyebrow="Impuesto"
          title={selection.row.name}
          meta={<RecordStatusBadge status={selection.row.status} />}
        >
          <Suspense fallback={<DetailSkeleton />}>
            <TaxDetailView detail={selection.detail} />
          </Suspense>
        </Modal>
      )}
    </>
  );
}
