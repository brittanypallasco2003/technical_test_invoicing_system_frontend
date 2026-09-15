"use client";

import { Suspense } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DetailSkeleton } from "@/components/ui/detail";
import { Modal } from "@/components/ui/dialog";
import { RecordStatusBadge } from "@/features/shared/status-badges";
import { useRecordDetail } from "@/hooks/use-record-detail";
import { getEstablishment } from "@/services/establishments";
import type { Establishment } from "@/types/establishment";
import { EstablishmentDetailView } from "./establishment-detail";

const columns: DataTableColumn<Establishment>[] = [
  { id: "code", header: "Código", cell: (establishment) => establishment.code, mono: true },
  { id: "name", header: "Nombre", cell: (establishment) => establishment.name, emphasis: true },
  { id: "address", header: "Dirección", cell: (establishment) => establishment.address },
  {
    id: "status",
    header: "Estado",
    cell: (establishment) => <RecordStatusBadge status={establishment.status} />,
  },
];

export function EstablishmentsTable({ establishments }: { establishments: Establishment[] }) {
  const { selection, open, close } = useRecordDetail((establishment: Establishment) =>
    getEstablishment(establishment.id),
  );

  return (
    <>
      <DataTable
        caption="Establecimientos"
        columns={columns}
        rows={establishments}
        getRowId={(establishment) => establishment.id}
        getRowLabel={(establishment) => establishment.name}
        onRowSelect={open}
        selectedRowId={selection?.row.id}
        emptyMessage="No hay establecimientos registrados."
      />
      {selection && (
        <Modal
          open
          size="lg"
          onClose={close}
          eyebrow={`Establecimiento ${selection.row.code}`}
          title={selection.row.name}
          meta={<RecordStatusBadge status={selection.row.status} />}
        >
          <Suspense fallback={<DetailSkeleton />}>
            <EstablishmentDetailView detail={selection.detail} />
          </Suspense>
        </Modal>
      )}
    </>
  );
}
