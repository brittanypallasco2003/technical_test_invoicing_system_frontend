import { formatQuantity } from "@/lib/format";
import { calculateInvoiceTotals, type InvoiceTotals } from "@/lib/invoice-totals";
import { PaymentMethod, type CreateInvoicePayload } from "@/types/invoice";
import type { Product, ProductAvailability } from "@/types/product";

/** Form state: inputs stay strings until the payload is built. */
export interface InvoiceItemDraft {
  key: string;
  productId: string;
  quantity: string;
}

export interface InvoiceDraft {
  establishmentId: string;
  issuePointId: string;
  customerId: string;
  paymentMethod: PaymentMethod | "";
  items: InvoiceItemDraft[];
}

export type InvoiceDraftErrors = Partial<Record<string, string>>;

export const PAYMENT_METHODS = Object.values(PaymentMethod);

export function toPaymentMethod(value: string): PaymentMethod | "" {
  return PAYMENT_METHODS.find((method) => method === value) ?? "";
}

export function itemFieldName(itemKey: string, field: "productId" | "quantity"): string {
  return `items.${itemKey}.${field}`;
}

/** Accepts `2,5` as well as `2.5`; returns `null` for anything that is not a number. */
export function parseQuantity(value: string): number | null {
  if (value.trim() === "") return null;
  const quantity = Number(value.replace(",", "."));
  return Number.isFinite(quantity) ? quantity : null;
}

/** One wording for the two checks that report stock: the local one and the live one. */
function stockMessage(stock: number): string {
  return stock > 0 ? `Solo quedan ${formatQuantity(stock)} en stock.` : "Sin stock disponible.";
}

export function validateInvoiceDraft(
  draft: InvoiceDraft,
  productsById: ReadonlyMap<string, Product>,
): InvoiceDraftErrors {
  const errors: InvoiceDraftErrors = {};

  if (!draft.establishmentId) errors.establishmentId = "Selecciona un establecimiento.";
  if (!draft.issuePointId) errors.issuePointId = "Selecciona un punto de emisión.";
  if (!draft.customerId) errors.customerId = "Selecciona un cliente.";
  if (!draft.paymentMethod) errors.paymentMethod = "Selecciona la forma de pago.";
  if (draft.items.length === 0) errors.items = "Agrega al menos un producto.";

  for (const item of draft.items) {
    const product = productsById.get(item.productId);
    if (!product) {
      errors[itemFieldName(item.key, "productId")] = "Selecciona un producto.";
    }

    const quantity = parseQuantity(item.quantity);
    if (quantity === null || quantity <= 0) {
      errors[itemFieldName(item.key, "quantity")] = "Ingresa una cantidad mayor a 0.";
    } else if (product && quantity > product.stock) {
      errors[itemFieldName(item.key, "quantity")] = stockMessage(product.stock);
    }
  }

  return errors;
}

/**
 * What the availability check found, as field errors.
 *
 * The stock loaded with the page can be minutes old; these answers are the
 * catalogue as it stands right now, so they are what stops the submit.
 */
export function availabilityErrors(
  items: readonly InvoiceItemDraft[],
  availability: ReadonlyMap<string, ProductAvailability>,
): InvoiceDraftErrors {
  const errors: InvoiceDraftErrors = {};

  for (const item of items) {
    const answer = availability.get(item.key);
    if (!answer || answer.available) continue;

    if (answer.reason === "NOT_ACTIVE") {
      errors[itemFieldName(item.key, "productId")] = "El producto ya no está disponible.";
    } else {
      errors[itemFieldName(item.key, "quantity")] = stockMessage(answer.stock);
    }
  }

  return errors;
}

/** Preview of the totals, skipping lines that are not complete yet. */
export function previewDraftTotals(
  draft: InvoiceDraft,
  productsById: ReadonlyMap<string, Product>,
): InvoiceTotals {
  return calculateInvoiceTotals(
    draft.items.flatMap((item) => {
      const product = productsById.get(item.productId);
      const quantity = parseQuantity(item.quantity);
      if (!product || quantity === null || quantity <= 0) return [];
      return [{ quantity, unitPrice: product.unitPrice, taxRate: product.tax.rate }];
    }),
  );
}

/** Call only after `validateInvoiceDraft` returned no errors. */
export function toCreateInvoicePayload(draft: InvoiceDraft): CreateInvoicePayload {
  if (!draft.paymentMethod) throw new Error("The draft has not been validated");

  return {
    customerId: draft.customerId,
    issuePointId: draft.issuePointId,
    paymentMethod: draft.paymentMethod,
    items: draft.items.map((item) => ({
      productId: item.productId,
      quantity: parseQuantity(item.quantity) ?? 0,
    })),
  };
}
