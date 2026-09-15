import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { EstablishmentsTable } from "@/features/establishments/establishments-table";
import { listEstablishments } from "@/services/establishments";

export const metadata: Metadata = { title: "Establecimientos" };

export default async function EstablishmentsPage() {
  const establishments = await listEstablishments();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Establecimientos"
        description="Locales desde donde se emiten comprobantes."
      />
      <EstablishmentsTable establishments={establishments} />
    </div>
  );
}
