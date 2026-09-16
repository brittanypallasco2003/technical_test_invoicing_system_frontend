"use client";

import { useRouter } from "next/navigation";
import {
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  type FormEvent,
} from "react";
import { PlusIcon, TrashIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DescriptionList } from "@/components/ui/detail";
import { Field, Input, Select, StaticField } from "@/components/ui/form-controls";
import { formatCurrency, formatQuantity, formatToday } from "@/lib/format";
import { calculateLineSubtotal } from "@/lib/invoice-totals";
import { IDENTIFICATION_TYPE_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/labels";
import { ApiError } from "@/services/api-client";
import { getEstablishment } from "@/services/establishments";
import { createInvoice } from "@/services/invoices";
import type { Customer } from "@/types/customer";
import type { Establishment, IssuePoint } from "@/types/establishment";
import type { Product } from "@/types/product";
import {
  availabilityErrors,
  itemFieldName,
  parseQuantity,
  PAYMENT_METHODS,
  previewDraftTotals,
  toCreateInvoicePayload,
  toPaymentMethod,
  validateInvoiceDraft,
  type InvoiceDraft,
  type InvoiceDraftErrors,
  type InvoiceItemDraft,
} from "./invoice-draft";
import { InvoiceTotalsList } from "./invoice-totals-list";
import { useProductAvailability } from "./use-product-availability";

const INITIAL_DRAFT: InvoiceDraft = {
  establishmentId: "",
  issuePointId: "",
  customerId: "",
  paymentMethod: "",
  items: [{ key: "item-0", productId: "", quantity: "1" }],
};

const ITEM_GRID = "md:grid-cols-[minmax(0,1fr)_96px_112px_112px_40px]";

const subscribeToNothing = () => () => {};

interface InvoiceFormProps {
  establishments: Establishment[];
  customers: Customer[];
  products: Product[];
}

export function InvoiceForm({ establishments, customers, products }: InvoiceFormProps) {
  const router = useRouter();
  const formId = useId();
  const nextItemKey = useRef(1);
  const latestEstablishmentId = useRef("");

  const [draft, setDraft] = useState<InvoiceDraft>(INITIAL_DRAFT);
  const [errors, setErrors] = useState<InvoiceDraftErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [issuePoints, setIssuePoints] = useState<IssuePoint[]>([]);
  const [isLoadingIssuePoints, startLoadingIssuePoints] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();

  // Rendered only on the client: the server would print the build date.
  const issueDate = useSyncExternalStore(subscribeToNothing, formatToday, () => null);

  const productsById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );
  const selectedCustomer = customers.find((customer) => customer.id === draft.customerId);
  const totals = previewDraftTotals(draft, productsById);

  // Checked against the API while the form is filled in, so a line that ran out
  // of stock elsewhere is marked before the user submits.
  const availability = useProductAvailability(draft.items);
  const stockErrors = availabilityErrors(draft.items, availability);
  const errorCount = Object.keys(errors).length + Object.keys(stockErrors).length;

  const fieldId = (name: string) => `${formId}-${name.replaceAll(".", "-")}`;

  /** What a field shows: what the user typed first, what the catalogue says after. */
  const fieldError = (name: string) => errors[name] ?? stockErrors[name];

  /** Label and error wiring for `Field`. */
  const fieldProps = (label: string, name: string) => ({
    label,
    htmlFor: fieldId(name),
    error: fieldError(name),
    errorId: `${fieldId(name)}-error`,
  });

  /** Accessibility wiring for the control inside a `Field`. */
  const controlProps = (name: string) => ({
    id: fieldId(name),
    "aria-invalid": fieldError(name) ? true : undefined,
    "aria-describedby": fieldError(name) ? `${fieldId(name)}-error` : undefined,
  });

  function clearErrors(...names: string[]) {
    setErrors((current) => {
      if (!names.some((name) => name in current)) return current;
      const next = { ...current };
      for (const name of names) delete next[name];
      return next;
    });
  }

  function updateDraft(patch: Partial<InvoiceDraft>, ...touchedFields: string[]) {
    setDraft((current) => ({ ...current, ...patch }));
    clearErrors(...touchedFields);
  }

  function updateItem(key: string, patch: Partial<Omit<InvoiceItemDraft, "key">>) {
    setDraft((current) => ({
      ...current,
      items: current.items.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    }));
    clearErrors(...Object.keys(patch).map((field) => itemFieldName(key, field as "productId" | "quantity")));
  }

  function addItem() {
    const key = `item-${nextItemKey.current++}`;
    setDraft((current) => ({ ...current, items: [...current.items, { key, productId: "", quantity: "1" }] }));
    clearErrors("items");
  }

  function removeItem(key: string) {
    setDraft((current) => ({ ...current, items: current.items.filter((item) => item.key !== key) }));
    clearErrors(itemFieldName(key, "productId"), itemFieldName(key, "quantity"));
  }

  function handleEstablishmentChange(establishmentId: string) {
    latestEstablishmentId.current = establishmentId;
    updateDraft({ establishmentId, issuePointId: "" }, "establishmentId", "issuePointId");
    setIssuePoints([]);
    if (!establishmentId) return;

    startLoadingIssuePoints(async () => {
      try {
        const establishment = await getEstablishment(establishmentId);
        // Ignore the response if the user picked another establishment meanwhile.
        if (latestEstablishmentId.current !== establishmentId) return;

        const activePoints = establishment.issuePoints.filter((point) => point.status === "ACTIVE");
        setIssuePoints(activePoints);
        if (activePoints.length === 1) updateDraft({ issuePointId: activePoints[0].id });
      } catch {
        setErrors((current) => ({
          ...current,
          issuePointId: "No se pudieron cargar los puntos de emisión.",
        }));
      }
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const validationErrors = validateInvoiceDraft(draft, productsById);
    setErrors(validationErrors);
    // A line the catalogue already refuses would come back as a 409 anyway.
    if (Object.keys(validationErrors).length > 0 || Object.keys(stockErrors).length > 0) return;

    startSubmitting(async () => {
      try {
        await createInvoice(toCreateInvoicePayload(draft));
        router.push("/facturas");
      } catch (error) {
        // A 409 says what the catalogue refused -- no stock, inactive customer,
        // a sequential taken twice -- and that is worth more than a generic
        // apology. Anything else gets one, because there is nothing to act on.
        const detail = error instanceof ApiError ? error.detail : null;
        setSubmitError(detail ?? "No se pudo emitir la factura. Inténtalo de nuevo.");
      }
    });
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]"
    >
      <div className="flex min-w-0 flex-col gap-5">
        <Card title="Emisión">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field {...fieldProps("Establecimiento", "establishmentId")}>
              <Select
                {...controlProps("establishmentId")}
                value={draft.establishmentId}
                onChange={(event) => handleEstablishmentChange(event.target.value)}
              >
                <option value="">Selecciona…</option>
                {establishments.map((establishment) => (
                  <option key={establishment.id} value={establishment.id}>
                    {`${establishment.code} · ${establishment.name}`}
                  </option>
                ))}
              </Select>
            </Field>

            <Field {...fieldProps("Punto de emisión", "issuePointId")}>
              <Select
                {...controlProps("issuePointId")}
                value={draft.issuePointId}
                disabled={!draft.establishmentId || isLoadingIssuePoints}
                onChange={(event) => updateDraft({ issuePointId: event.target.value }, "issuePointId")}
              >
                <option value="">{isLoadingIssuePoints ? "Cargando…" : "Selecciona…"}</option>
                {issuePoints.map((point) => (
                  <option key={point.id} value={point.id}>
                    {`${point.code} · ${point.description ?? "Sin descripción"}`}
                  </option>
                ))}
              </Select>
            </Field>

            <StaticField label="Fecha de emisión" value={issueDate ?? "—"} mono />
          </div>
        </Card>

        <Card title="Cliente">
          <Field {...fieldProps("Cliente", "customerId")}>
            <Select
              {...controlProps("customerId")}
              value={draft.customerId}
              onChange={(event) => updateDraft({ customerId: event.target.value }, "customerId")}
            >
              <option value="">Selecciona un cliente…</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {`${customer.businessName} · ${customer.identification}`}
                </option>
              ))}
            </Select>
          </Field>
          {selectedCustomer && (
            <DescriptionList
              items={[
                {
                  label: "Tipo de identificación",
                  value: IDENTIFICATION_TYPE_LABELS[selectedCustomer.identificationType],
                },
                { label: "Identificación", value: selectedCustomer.identification, mono: true },
                { label: "Correo", value: selectedCustomer.email, fullWidth: true },
              ]}
            />
          )}
        </Card>

        <Card title="Productos">
          <div
            aria-hidden="true"
            className={`hidden gap-3 border-b border-headline/15 pb-2 text-[12.5px] font-medium text-paragraph md:grid ${ITEM_GRID}`}
          >
            <span>Producto</span>
            <span className="text-right">Cantidad</span>
            <span className="text-right">P. unitario</span>
            <span className="text-right">Subtotal</span>
            <span />
          </div>

          <ul className="flex flex-col gap-3">
            {draft.items.map((item, index) => {
              const product = productsById.get(item.productId);
              const quantity = parseQuantity(item.quantity);
              const subtotal =
                product && quantity !== null && quantity > 0
                  ? calculateLineSubtotal({ quantity, unitPrice: product.unitPrice, taxRate: product.tax.rate })
                  : null;
              const productField = itemFieldName(item.key, "productId");
              const quantityField = itemFieldName(item.key, "quantity");

              return (
                <li key={item.key} className={`grid grid-cols-[minmax(0,1fr)_96px] items-start gap-3 ${ITEM_GRID}`}>
                  <Field {...fieldProps(`Producto ${index + 1}`, productField)} hideLabel>
                    <Select
                      {...controlProps(productField)}
                      value={item.productId}
                      onChange={(event) => updateItem(item.key, { productId: event.target.value })}
                    >
                      <option value="">Selecciona un producto…</option>
                      {products.map((option) => (
                        <option key={option.id} value={option.id}>
                          {`${option.mainCode} · ${option.name}`}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field {...fieldProps(`Cantidad ${index + 1}`, quantityField)} hideLabel>
                    <Input
                      {...controlProps(quantityField)}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="any"
                      value={item.quantity}
                      onChange={(event) => updateItem(item.key, { quantity: event.target.value })}
                      className="text-right font-mono"
                    />
                  </Field>

                  <div className="flex h-10 flex-col items-end justify-center">
                    <span className="font-mono text-[14.5px] text-headline">
                      {product ? formatCurrency(product.unitPrice) : "—"}
                    </span>
                    {product && (
                      <span className="text-xs text-paragraph">
                        IVA {formatQuantity(product.tax.rate)} %
                      </span>
                    )}
                  </div>

                  <span className="flex h-10 items-center justify-end font-mono text-[14.5px] font-semibold text-headline">
                    {subtotal === null ? "—" : formatCurrency(subtotal)}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.key)}
                    disabled={draft.items.length === 1}
                    aria-label={`Quitar producto ${index + 1}`}
                    title="Quitar producto"
                  >
                    <TrashIcon className="size-4.5" />
                  </Button>
                </li>
              );
            })}
          </ul>

          {errors.items && <p className="text-[12.5px] font-medium text-danger-strong">{errors.items}</p>}

          <button
            type="button"
            onClick={addItem}
            className="flex h-10 items-center justify-center gap-2 rounded-md border border-dashed border-headline/50 text-[14.5px] font-semibold text-headline hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke"
          >
            <PlusIcon className="size-4.5" />
            Agregar producto
          </button>
        </Card>
      </div>

      <Card title="Resumen" className="xl:sticky xl:top-0">
        <Field {...fieldProps("Forma de pago", "paymentMethod")}>
          <Select
            {...controlProps("paymentMethod")}
            value={draft.paymentMethod}
            onChange={(event) =>
              updateDraft({ paymentMethod: toPaymentMethod(event.target.value) }, "paymentMethod")
            }
          >
            <option value="">Selecciona…</option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {`${method} · ${PAYMENT_METHOD_LABELS[method]}`}
              </option>
            ))}
          </Select>
        </Field>

        <div className="border-t border-headline/15 pt-4">
          <InvoiceTotalsList totals={totals} />
        </div>
        <p className="text-xs text-paragraph">
          Valores referenciales: el total definitivo se calcula al emitir la factura.
        </p>

        <div aria-live="polite" className="empty:hidden">
          {errorCount > 0 && (
            <p className="text-[13px] font-medium text-danger-strong">
              Revisa los campos marcados antes de emitir.
            </p>
          )}
          {submitError && <p className="text-[13px] font-medium text-danger-strong">{submitError}</p>}
        </div>

        <div className="flex flex-col gap-2.5">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Emitiendo…" : "Emitir factura"}
          </Button>
          <ButtonLink href="/facturas" variant="secondary">
            Cancelar
          </ButtonLink>
        </div>
      </Card>
    </form>
  );
}
