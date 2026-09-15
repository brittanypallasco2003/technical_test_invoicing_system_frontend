import type { Metadata } from "next";
import { PlusIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { InvoicesTable } from "@/features/invoices/invoices-table";
import { listInvoices } from "@/services/invoices";

export const metadata: Metadata = { title: "Facturas" };

export default async function InvoicesPage() {
  const invoices = await listInvoices();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Facturas"
        description="Comprobantes emitidos y su estado en el SRI."
        actions={
          <ButtonLink href="/facturas/nueva">
            <PlusIcon className="size-5" />
            Crear factura
          </ButtonLink>
        }
      />
      <InvoicesTable invoices={invoices} />
    </div>
  );
}
