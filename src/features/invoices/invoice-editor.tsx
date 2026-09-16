"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { Field, Select, StaticField } from "@/components/ui/form-controls";
import { CustomerCombobox } from "@/features/customers/customer-combobox";
import { formatCurrency } from "@/lib/format";
import { PAYMENT_METHOD_LABELS } from "@/lib/labels";
import { ApiError } from "@/services/api-client";
import { updateInvoice } from "@/services/invoices";
import type { Customer } from "@/types/customer";
import type { Invoice, PaymentMethod, UpdateInvoicePayload } from "@/types/invoice";
import { PAYMENT_METHODS, toPaymentMethod } from "./invoice-draft";
import { isAmendable } from "./invoice-lifecycle";

interface InvoiceEditorProps {
  invoice: Invoice;
  /** Called after the API accepts the correction. */
  onCorrected: () => void;
}

export function InvoiceEditor({ invoice, onCorrected }: InvoiceEditorProps) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(invoice.paymentMethod);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  if (!isAmendable(invoice.invoiceStatus)) return null;

  function close() {
    setOpen(false);
  }

  function reopen() {
    setCustomer(null);
    setPaymentMethod(invoice.paymentMethod);
    setError(null);
    setOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // Only what changed travels: an absent field means "keep what the invoice
    // already says", and an empty body is a valid resubmission.
    const payload: UpdateInvoicePayload = {};
    if (customer) payload.customerId = customer.id;
    if (paymentMethod !== invoice.paymentMethod) payload.paymentMethod = paymentMethod;

    startSaving(async () => {
      try {
        await updateInvoice(invoice.id, payload);
        setOpen(false);
        onCorrected();
      } catch (caught) {
        // A 409 says why the document is past correcting, and that is what the
        // user has to act on.
        const detail = caught instanceof ApiError ? caught.detail : null;
        setError(detail ?? "No se pudo corregir la factura. Inténtalo de nuevo.");
      }
    });
  }

  return (
    <>
      <Button variant="secondary" onClick={reopen}>
        Corregir
      </Button>

      {open && (
        <Modal
          open
          size="lg"
          onClose={close}
          eyebrow={`Factura ${invoice.number}`}
          title="Corregir comprobante"
        >
          <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-5">
            <p className="text-[13.5px] leading-snug text-paragraph">
              Solo se corrigen el comprador y la forma de pago; para cambiar productos o
              cantidades, emite una nueva factura. Al guardar, el comprobante se regenera y se
              reenvía al SRI.
            </p>

            <Field label="Comprador" htmlFor={`${formId}-customer`}>
              <CustomerCombobox
                id={`${formId}-customer`}
                selected={customer}
                onSelect={setCustomer}
                initialQuery={invoice.buyerBusinessName}
              />
            </Field>
            <p className="-mt-3 text-[12.5px] text-paragraph">
              {customer
                ? `Se reemplaza por ${customer.businessName}.`
                : "Si no eliges otro, se conserva el comprador actual."}
            </p>

            <Field label="Forma de pago" htmlFor={`${formId}-payment`}>
              <Select
                id={`${formId}-payment`}
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(toPaymentMethod(event.target.value) || invoice.paymentMethod)
                }
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {`${method} · ${PAYMENT_METHOD_LABELS[method]}`}
                  </option>
                ))}
              </Select>
            </Field>

            {/* Shown, not editable: the fields the SRI adds up again, plus the
                numbering that the access key already carries. */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StaticField label="Número" value={invoice.number} mono />
              <StaticField
                label="Líneas"
                value={`${invoice.items.length} ${invoice.items.length === 1 ? "producto" : "productos"}`}
              />
              <StaticField label="Total" value={formatCurrency(invoice.totalAmount)} mono />
            </div>

            {error && (
              <p role="alert" className="text-[13px] font-medium text-danger-strong">
                {error}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-2.5">
              <Button variant="secondary" onClick={close} disabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Guardando…" : "Guardar y reenviar"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
