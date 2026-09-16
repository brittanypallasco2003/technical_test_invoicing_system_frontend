import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProductsTable } from "@/features/products/products-table";
import { listProducts } from "@/services/products";

export const metadata: Metadata = { title: "Productos" };

export default async function ProductsPage() {
  const products = await listProducts();

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Productos" description="Bienes y servicios que se facturan." />
      <ProductsTable products={products} />
    </div>
  );
}
