"use client";

import { useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DescriptionList } from "@/components/ui/detail";
import { Modal } from "@/components/ui/dialog";
import { RecordStatusBadge } from "@/features/shared/status-badges";
import { formatRate } from "@/lib/format";
import { TAX_CODE_LABELS } from "@/lib/labels";
import type { Tax } from "@/types/tax";

const columns: DataTableColumn<Tax>[] = [
  { id: "code", header: "Código", cell: (tax) => tax.code, mono: true },
  { id: "percentageCode", header: "Cód. porcentaje", cell: (tax) => tax.percentageCode, mono: true },
  { id: "name", header: "Nombre", cell: (tax) => tax.name, emphasis: true },
  { id: "rate", header: "Tarifa", cell: (tax) => formatRate(tax.rate), align: "right", mono: true },
  { id: "status", header: "Estado", cell: (tax) => <RecordStatusBadge status={tax.status} /> },
];

export function TaxesTable({ taxes }: { taxes: Tax[] }) {
  // The catalogue has no detail endpoint: the row already holds every field.
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null);

  return (
    <>
      <DataTable
        caption="Impuestos"
        columns={columns}
        rows={taxes}
        getRowId={(tax) => String(tax.id)}
        getRowLabel={(tax) => tax.name}
        onRowSelect={setSelectedTax}
        selectedRowId={selectedTax ? String(selectedTax.id) : null}
        emptyMessage="No hay impuestos registrados."
      />
      {selectedTax && (
        <Modal
          open
          onClose={() => setSelectedTax(null)}
          eyebrow="Impuesto"
          title={selectedTax.name}
          meta={<RecordStatusBadge status={selectedTax.status} />}
        >
          <DescriptionList
            items={[
              {
                label: "Impuesto",
                value: `${selectedTax.code} · ${TAX_CODE_LABELS[selectedTax.code] ?? "Otro"}`,
              },
              { label: "Código de porcentaje", value: selectedTax.percentageCode, mono: true },
              { label: "Tarifa", value: formatRate(selectedTax.rate), mono: true },
            ]}
          />
        </Modal>
      )}
    </>
  );
}
