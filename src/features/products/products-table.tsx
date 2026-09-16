"use client";

import { Suspense, use } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DescriptionList, DetailSkeleton } from "@/components/ui/detail";
import { Modal } from "@/components/ui/dialog";
import { RecordStatusBadge } from "@/features/shared/status-badges";
import { useRecordDetail } from "@/hooks/use-record-detail";
import { formatCurrency, formatQuantity } from "@/lib/format";
import { getProduct } from "@/services/products";
import type { Product } from "@/types/product";

const columns: DataTableColumn<Product>[] = [
  { id: "mainCode", header: "Código", cell: (product) => product.mainCode, mono: true },
  { id: "name", header: "Nombre", cell: (product) => product.name, emphasis: true },
  {
    id: "unitPrice",
    header: "Precio unit.",
    cell: (product) => formatCurrency(product.unitPrice),
    align: "right",
    mono: true,
  },
  { id: "stock", header: "Stock", cell: (product) => product.stock, align: "right", mono: true },
  { id: "tax", header: "Impuesto", cell: (product) => product.tax.name },
  { id: "status", header: "Estado", cell: (product) => <RecordStatusBadge status={product.status} /> },
];

/**
 * `GET /products/:id` answers the same DTO as the listing, so this adds no
 * field. What it adds is freshness, and it matters most for the stock: the one
 * value that moves on its own, every time somebody else issues an invoice.
 */
function ProductDetailView({ detail }: { detail: Promise<Product> }) {
  const product = use(detail);

  return (
    <DescriptionList
      items={[
        { label: "Código principal", value: product.mainCode, mono: true },
        { label: "Código auxiliar", value: product.auxiliaryCode, mono: true },
        { label: "Precio unitario", value: formatCurrency(product.unitPrice), mono: true },
        { label: "Stock", value: formatQuantity(product.stock), mono: true },
        { label: "Impuesto", value: product.tax.name },
        { label: "Descripción", value: product.description, fullWidth: true },
      ]}
    />
  );
}

export function ProductsTable({ products }: { products: Product[] }) {
  const { selection, open, close } = useRecordDetail((product: Product) => getProduct(product.id));

  return (
    <>
      <DataTable
        caption="Productos"
        columns={columns}
        rows={products}
        getRowId={(product) => product.id}
        getRowLabel={(product) => product.name}
        onRowSelect={open}
        selectedRowId={selection?.row.id}
        emptyMessage="No hay productos registrados."
      />
      {selection && (
        <Modal
          open
          onClose={close}
          eyebrow={`Producto ${selection.row.mainCode}`}
          title={selection.row.name}
          meta={<RecordStatusBadge status={selection.row.status} />}
        >
          <Suspense fallback={<DetailSkeleton />}>
            <ProductDetailView detail={selection.detail} />
          </Suspense>
        </Modal>
      )}
    </>
  );
}
