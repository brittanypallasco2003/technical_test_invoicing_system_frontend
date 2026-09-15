"use client";

import { use } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DescriptionList, DetailBody, DetailSection } from "@/components/ui/detail";
import { RecordStatusBadge } from "@/features/shared/status-badges";
import { formatSequential } from "@/lib/format";
import type { EstablishmentDetail, IssuePoint } from "@/types/establishment";

const issuePointColumns: DataTableColumn<IssuePoint>[] = [
  { id: "code", header: "Código", cell: (point) => point.code, mono: true },
  { id: "description", header: "Descripción", cell: (point) => point.description ?? "—", emphasis: true },
  {
    id: "lastSequential",
    header: "Último secuencial",
    cell: (point) => formatSequential(point.lastSequential),
    align: "right",
    mono: true,
  },
  { id: "status", header: "Estado", cell: (point) => <RecordStatusBadge status={point.status} /> },
];

export function EstablishmentDetailView({ detail }: { detail: Promise<EstablishmentDetail> }) {
  const establishment = use(detail);

  return (
    <DetailBody>
      <DetailSection title="Datos">
        <DescriptionList
          items={[
            { label: "Código", value: establishment.code, mono: true },
            { label: "Nombre", value: establishment.name },
            { label: "Dirección", value: establishment.address, fullWidth: true },
          ]}
        />
      </DetailSection>
      <DetailSection title="Puntos de emisión">
        <DataTable
          size="sm"
          caption={`Puntos de emisión de ${establishment.name}`}
          columns={issuePointColumns}
          rows={establishment.issuePoints}
          getRowId={(point) => point.id}
          emptyMessage="Este establecimiento no tiene puntos de emisión."
        />
      </DetailSection>
    </DetailBody>
  );
}
