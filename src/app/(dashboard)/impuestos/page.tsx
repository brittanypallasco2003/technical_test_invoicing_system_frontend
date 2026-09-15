import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { TaxesTable } from "@/features/taxes/taxes-table";
import { listTaxes } from "@/services/taxes";

export const metadata: Metadata = { title: "Impuestos" };

export default async function TaxesPage() {
  const taxes = await listTaxes();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Impuestos" description="Catálogo de tarifas del SRI." />
      <TaxesTable taxes={taxes} />
    </div>
  );
}
