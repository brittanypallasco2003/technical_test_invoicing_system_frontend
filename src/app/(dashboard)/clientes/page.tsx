import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { CustomersTable } from "@/features/customers/customers-table";
import { listCustomers } from "@/services/customers";

export const metadata: Metadata = { title: "Clientes" };

export default async function CustomersPage() {
  const customers = await listCustomers();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Clientes" description="Compradores registrados." />
      <CustomersTable customers={customers} />
    </div>
  );
}
