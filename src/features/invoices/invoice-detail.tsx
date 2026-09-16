"use client";

import { use } from "react";
import { buttonStyles } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DescriptionList, DetailBody, DetailSection } from "@/components/ui/detail";
import { formatCurrency, formatIsoDate, formatQuantity, formatTimestamp } from "@/lib/format";
import { groupTaxBreakdown } from "@/lib/invoice-totals";
import { IDENTIFICATION_TYPE_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/labels";
import { invoiceXmlUrl } from "@/services/invoices";
import type { Invoice, InvoiceItem } from "@/types/invoice";
import { InvoiceTotalsList } from "./invoice-totals-list";
import { InvoiceXmlViewer } from "./invoice-xml";

const itemColumns: DataTableColumn<InvoiceItem>[] = [
  { id: "mainCode", header: "Código", cell: (item) => item.mainCode, mono: true },
  { id: "description", header: "Descripción", cell: (item) => item.description, emphasis: true },
  { id: "quantity", header: "Cant.", cell: (item) => formatQuantity(item.quantity), align: "right", mono: true },
  { id: "unitPrice", header: "P. unit.", cell: (item) => formatCurrency(item.unitPrice), align: "right", mono: true },
  {
    id: "subtotal",
    header: "Subtotal",
    cell: (item) => formatCurrency(item.totalPriceWithoutTax),
    align: "right",
    mono: true,
  },
];

export function InvoiceDetailView({ detail }: { detail: Promise<Invoice> }) {
  const invoice = use(detail);

  return (
    <DetailBody>
      {invoice.rejectionReason && (
        <p className="rounded-lg border-[1.5px] border-danger bg-danger-soft/40 p-3 text-[13.5px] leading-snug text-headline">
          <span className="font-semibold">El SRI rechazó el comprobante: </span>
          {invoice.rejectionReason}
        </p>
      )}

      <DetailSection title="Emisión">
        <DescriptionList
          items={[
            { label: "Fecha de emisión", value: formatIsoDate(invoice.issueDate), mono: true },
            {
              label: "Autorizada",
              value: invoice.authorizedAt ? formatTimestamp(invoice.authorizedAt) : null,
              mono: true,
            },
            {
              label: "Establecimiento · Punto de emisión",
              value: `${invoice.establishmentCode} · ${invoice.issuePointCode}`,
              mono: true,
            },
            {
              label: "Forma de pago",
              value: `${invoice.paymentMethod} · ${PAYMENT_METHOD_LABELS[invoice.paymentMethod]}`,
              fullWidth: true,
            },
            { label: "Clave de acceso", value: invoice.accessKey, mono: true, fullWidth: true },
          ]}
        />
        <div className="flex flex-wrap gap-2.5">
          <InvoiceXmlViewer invoiceId={invoice.id} number={invoice.number} />
          {/* A link and not a button: the response is a file, and the browser
              already knows what to do with the filename the API sends. */}
          <a
            href={invoiceXmlUrl(invoice.id)}
            download={`${invoice.accessKey}.xml`}
            className={buttonStyles({ variant: "secondary" })}
          >
            Descargar XML
          </a>
        </div>
      </DetailSection>

      <DetailSection title="Comprador">
        <DescriptionList
          items={[
            {
              label: "Tipo de identificación",
              value: IDENTIFICATION_TYPE_LABELS[invoice.buyerIdentificationType],
            },
            { label: "Identificación", value: invoice.buyerIdentification, mono: true },
            { label: "Razón social", value: invoice.buyerBusinessName, fullWidth: true },
            { label: "Dirección", value: invoice.buyerAddress, fullWidth: true },
          ]}
        />
      </DetailSection>

      <DetailSection title="Detalle">
        <DataTable
          size="sm"
          caption={`Productos de la factura ${invoice.number}`}
          columns={itemColumns}
          rows={invoice.items}
          getRowId={(item) => item.id}
        />
      </DetailSection>

      <DetailSection title="Totales">
        <div className="w-full max-w-80 self-end">
          <InvoiceTotalsList
            totals={{
              breakdown: groupTaxBreakdown(invoice.items),
              totalWithoutTaxes: invoice.totalWithoutTaxes,
              totalDiscount: invoice.totalDiscount,
              totalVat: invoice.totalVat,
              totalAmount: invoice.totalAmount,
            }}
          />
        </div>
      </DetailSection>
    </DetailBody>
  );
}
