"use client";

import { useEffect, useState } from "react";
import { checkProductAvailability } from "@/services/products";
import type { ProductAvailability } from "@/types/product";
import { parseQuantity, type InvoiceItemDraft } from "./invoice-draft";

/** Typing a quantity should not fire a request per keystroke. */
const DEBOUNCE_MS = 400;

interface AvailabilityQuery {
  itemKey: string;
  productId: string;
  quantity: number;
}

/** Lines complete enough to ask about: the rest have nothing to check yet. */
function pendingQueries(items: readonly InvoiceItemDraft[]): AvailabilityQuery[] {
  return items.flatMap((item) => {
    const quantity = parseQuantity(item.quantity);
    if (!item.productId || quantity === null || quantity <= 0) return [];
    return [{ itemKey: item.key, productId: item.productId, quantity }];
  });
}

/**
 * Asks the API whether each line can still be sold, keyed by item.
 *
 * A failed check answers nothing instead of blocking the form: the warning is a
 * courtesy, and issuing is what really guarantees the stock. Answers to a line
 * that changed meanwhile are dropped with the request that carried them.
 */
export function useProductAvailability(
  items: readonly InvoiceItemDraft[],
): ReadonlyMap<string, ProductAvailability> {
  const [availability, setAvailability] = useState<ReadonlyMap<string, ProductAvailability>>(
    new Map(),
  );

  // Serialized because `items` is a new array on every edit, and the effect has
  // to run when a line really changes -- not when the user picks a customer.
  const signature = JSON.stringify(pendingQueries(items));

  useEffect(() => {
    const queries: AvailabilityQuery[] = JSON.parse(signature);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      const answers = await Promise.all(
        queries.map(async (query) => {
          try {
            const answer = await checkProductAvailability(
              query.productId,
              query.quantity,
              controller.signal,
            );
            return [query.itemKey, answer] as const;
          } catch {
            return null;
          }
        }),
      );

      if (controller.signal.aborted) return;
      setAvailability(new Map(answers.filter((answer) => answer !== null)));
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [signature]);

  return availability;
}
