"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { ApiError } from "@/services/api-client";
import { deleteInvoice } from "@/services/invoices";
import type { Invoice } from "@/types/invoice";
import { isAmendable } from "./invoice-lifecycle";

interface InvoiceDeleteButtonProps {
  invoice: Invoice;
  /** Called after the API accepts the deletion. */
  onDeleted: () => void;
}

export function InvoiceDeleteButton({ invoice, onDeleted }: InvoiceDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, startDeleting] = useTransition();

  if (!isAmendable(invoice.invoiceStatus)) return null;

  function confirm() {
    startDeleting(async () => {
      try {
        await deleteInvoice(invoice.id);
        setOpen(false);
        onDeleted();
      } catch (caught) {
        // A 409 says why the document can no longer be discarded, and that is
        // what the user has to act on.
        const detail = caught instanceof ApiError ? caught.detail : null;
        setError(detail ?? "No se pudo eliminar la factura. Inténtalo de nuevo.");
      }
    });
  }

  return (
    <>
      <Button
        variant="danger"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        Eliminar
      </Button>

      {open && (
        <Modal
          open
          onClose={() => setOpen(false)}
          eyebrow={`Factura ${invoice.number}`}
          title="Eliminar factura"
        >
          <div className="flex flex-col gap-5">
            <p className="text-[14.5px] leading-snug text-paragraph">
              La factura deja de aparecer en el listado y no se puede recuperar. El número{" "}
              <span className="font-mono text-[13.5px] text-headline">{invoice.number}</span> queda
              consumido, porque el SRI exige numeración sin saltos.
            </p>

            {error && (
              <p role="alert" className="text-[13px] font-medium text-danger-strong">
                {error}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-2.5">
              <Button variant="secondary" onClick={() => setOpen(false)} disabled={isDeleting}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirm} disabled={isDeleting}>
                {isDeleting ? "Eliminando…" : "Eliminar factura"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
