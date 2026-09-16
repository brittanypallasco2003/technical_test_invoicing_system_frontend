import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { InvoiceForm } from "@/features/invoices/invoice-form";
import { listEstablishments } from "@/services/establishments";
import { listProducts } from "@/services/products";

export const metadata: Metadata = { title: "Nueva factura" };

export default async function NewInvoicePage() {
  // Customers are not loaded here: the form searches them by name, so a large
  // directory never travels to fill one field.
  const [establishments, products] = await Promise.all([listEstablishments(), listProducts()]);

  // Only active records can be used on a new invoice.
  const isActive = (record: { status: string }) => record.status === "ACTIVE";

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        back={{ href: "/facturas", label: "Facturas" }}
        title="Nueva factura"
        description="Completa los datos para emitir el comprobante."
      />
      <InvoiceForm
        establishments={establishments.filter(isActive)}
        products={products.filter(isActive)}
      />
    </div>
  );
}
