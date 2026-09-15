"use client";

import { useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DescriptionList } from "@/components/ui/detail";
import { Modal } from "@/components/ui/dialog";
import { RecordStatusBadge } from "@/features/shared/status-badges";
import { formatCurrency } from "@/lib/format";
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

export function ProductsTable({ products }: { products: Product[] }) {
  // `ProductResponseDto` is the same shape for the listing and the detail.
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <DataTable
        caption="Productos"
        columns={columns}
        rows={products}
        getRowId={(product) => product.id}
        getRowLabel={(product) => product.name}
        onRowSelect={setSelectedProduct}
        selectedRowId={selectedProduct?.id}
        emptyMessage="No hay productos registrados."
      />
      {selectedProduct && (
        <Modal
          open
          onClose={() => setSelectedProduct(null)}
          eyebrow={`Producto ${selectedProduct.mainCode}`}
          title={selectedProduct.name}
          meta={<RecordStatusBadge status={selectedProduct.status} />}
        >
          <DescriptionList
            items={[
              { label: "Código principal", value: selectedProduct.mainCode, mono: true },
              { label: "Código auxiliar", value: selectedProduct.auxiliaryCode, mono: true },
              { label: "Precio unitario", value: formatCurrency(selectedProduct.unitPrice), mono: true },
              { label: "Stock", value: selectedProduct.stock, mono: true },
              { label: "Impuesto", value: selectedProduct.tax.name },
              { label: "Descripción", value: selectedProduct.description, fullWidth: true },
            ]}
          />
        </Modal>
      )}
    </>
  );
}
