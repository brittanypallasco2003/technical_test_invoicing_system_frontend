"use client";

import { useEffect, useState } from "react";
import { listCustomers } from "@/services/customers";
import type { Customer } from "@/types/customer";

/**
 * Below this, a term matches most of the directory: the request would cost a
 * round trip and a lot of rows to answer a question nobody asked yet.
 */
export const MIN_TERM_LENGTH = 2;

/** Long enough to skip the letters of a word, short enough to feel immediate. */
const DEBOUNCE_MS = 300;

type SearchStatus = "idle" | "searching" | "ready" | "error";

interface CustomerSearch {
  status: SearchStatus;
  results: Customer[];
}

/** One spelling per term, so "  Juan   Perez " and "juan perez" share an answer. */
function normalize(term: string): string {
  return term.trim().replace(/\s+/g, " ").toLowerCase();
}

function nameContains(customer: Customer, term: string): boolean {
  return customer.businessName.toLowerCase().includes(term);
}

/**
 * The answer to `term` from what the browser already has, or `null` when it has
 * to be asked for.
 *
 * The API matches names that CONTAIN the term, so whatever matches a longer
 * term also matches every term inside it: the rows for "juan pe" are exactly
 * the rows for "juan" filtered again. Typing one more letter is therefore a
 * filter over answers already in hand, not another round trip -- and so is
 * deleting one, because the shorter term was usually answered on the way in.
 *
 * The longest cached term wins, because it is the smallest list to filter.
 */
function answerFromCache(
  cache: ReadonlyMap<string, Customer[]>,
  term: string,
): Customer[] | null {
  const exact = cache.get(term);
  if (exact) return exact;

  let best: { term: string; results: Customer[] } | null = null;

  for (const [cachedTerm, results] of cache) {
    if (!term.includes(cachedTerm)) continue;
    if (!best || cachedTerm.length > best.term.length) best = { term: cachedTerm, results };
  }

  return best ? best.results.filter((customer) => nameContains(customer, term)) : null;
}

/**
 * Customers whose business name matches what is being typed.
 *
 * The directory is never loaded whole: an issuer with thousands of customers
 * would pay for all of them to fill one field. What keeps the traffic down is
 * the minimum term, the debounce and the cache above; what keeps the answers
 * honest is the `AbortController`, which drops the reply to a term the user has
 * already moved past.
 */
export function useCustomerSearch(term: string): CustomerSearch {
  /** Only fetched answers are stored; the narrowed ones are cheap to recompute. */
  const [cache, setCache] = useState<ReadonlyMap<string, Customer[]>>(new Map());
  const [failedTerm, setFailedTerm] = useState<string | null>(null);

  const normalized = normalize(term);
  const tooShort = normalized.length < MIN_TERM_LENGTH;
  const answer = tooShort ? null : answerFromCache(cache, normalized);
  const answered = answer !== null;
  const failed = failedTerm === normalized;

  useEffect(() => {
    // Nothing to ask: the term is too short, the answer is already here, or
    // this exact term just failed and retrying it on its own would loop.
    if (tooShort || answered || failed) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const results = await listCustomers(normalized, controller.signal);
        setCache((current) => new Map(current).set(normalized, results));
      } catch {
        if (!controller.signal.aborted) setFailedTerm(normalized);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [normalized, tooShort, answered, failed]);

  if (tooShort) return { status: "idle", results: [] };
  if (answer) return { status: "ready", results: answer };
  if (failed) return { status: "error", results: [] };
  return { status: "searching", results: [] };
}
