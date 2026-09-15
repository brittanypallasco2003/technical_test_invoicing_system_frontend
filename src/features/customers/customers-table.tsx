"use client";

import { Suspense, use } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DescriptionList, DetailSkeleton } from "@/components/ui/detail";
import { Modal } from "@/components/ui/dialog";
import { RecordStatusBadge } from "@/features/shared/status-badges";
import { useRecordDetail } from "@/hooks/use-record-detail";
import { IDENTIFICATION_TYPE_LABELS } from "@/lib/labels";
import { getCustomer } from "@/services/customers";
import type { Customer, CustomerDetail } from "@/types/customer";

const columns: DataTableColumn<Customer>[] = [
  {
    id: "identificationType",
    header: "Tipo",
    cell: (customer) => IDENTIFICATION_TYPE_LABELS[customer.identificationType],
  },
  { id: "identification", header: "Identificación", cell: (customer) => customer.identification, mono: true },
  { id: "businessName", header: "Razón social", cell: (customer) => customer.businessName, emphasis: true },
  { id: "email", header: "Correo", cell: (customer) => customer.email ?? "—" },
  { id: "status", header: "Estado", cell: (customer) => <RecordStatusBadge status={customer.status} /> },
];

function CustomerDetailView({ detail }: { detail: Promise<CustomerDetail> }) {
  const customer = use(detail);

  return (
    <DescriptionList
      items={[
        { label: "Tipo de identificación", value: IDENTIFICATION_TYPE_LABELS[customer.identificationType] },
        { label: "Identificación", value: customer.identification, mono: true },
        { label: "Correo", value: customer.email, fullWidth: true },
        { label: "Dirección", value: customer.address, fullWidth: true },
      ]}
    />
  );
}

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const { selection, open, close } = useRecordDetail((customer: Customer) => getCustomer(customer.id));

  return (
    <>
      <DataTable
        caption="Clientes"
        columns={columns}
        rows={customers}
        getRowId={(customer) => customer.id}
        getRowLabel={(customer) => customer.businessName}
        onRowSelect={open}
        selectedRowId={selection?.row.id}
        emptyMessage="No hay clientes registrados."
      />
      {selection && (
        <Modal
          open
          onClose={close}
          eyebrow="Cliente"
          title={selection.row.businessName}
          meta={<RecordStatusBadge status={selection.row.status} />}
        >
          <Suspense fallback={<DetailSkeleton />}>
            <CustomerDetailView detail={selection.detail} />
          </Suspense>
        </Modal>
      )}
    </>
  );
}
