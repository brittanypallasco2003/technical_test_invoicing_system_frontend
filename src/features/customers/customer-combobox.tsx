"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/form-controls";
import { cn } from "@/lib/cn";
import { IDENTIFICATION_TYPE_LABELS } from "@/lib/labels";
import type { Customer } from "@/types/customer";
import { MIN_TERM_LENGTH, useCustomerSearch } from "./use-customer-search";

/** A list longer than this is not read, it is scrolled past: better to type more. */
const VISIBLE_RESULTS = 8;

interface CustomerComboboxProps {
  selected: Customer | null;
  onSelect: (customer: Customer | null) => void;
  /** Text the field starts with, for a buyer known by name but not as a record. */
  initialQuery?: string;
  /** Spread from the form's `controlProps`, so the label and errors stay wired. */
  id: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function CustomerCombobox({
  selected,
  onSelect,
  initialQuery,
  id,
  ...aria
}: CustomerComboboxProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(initialQuery ?? selected?.businessName ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Searching stops when the list is closed: a chosen customer is not a term.
  const { status, results } = useCustomerSearch(open ? query : "");

  // An inactive customer cannot be invoiced, so it is not offered.
  const selectable = results.filter((customer) => customer.status === "ACTIVE");
  const visible = selectable.slice(0, VISIBLE_RESULTS);
  const hidden = selectable.length - visible.length;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function select(customer: Customer) {
    onSelect(customer);
    setQuery(customer.businessName);
    setOpen(false);
  }

  function handleChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
    setOpen(true);
    // The text no longer names the chosen customer, so the choice is undone
    // rather than left behind for the form to submit.
    if (selected) onSelect(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => {
        const last = visible.length - 1;
        if (last < 0) return 0;
        const next = event.key === "ArrowDown" ? current + 1 : current - 1;
        return next < 0 ? last : next > last ? 0 : next;
      });
      return;
    }

    if (event.key === "Enter" && open && visible[activeIndex]) {
      // Enter picks the highlighted customer; it does not submit the invoice.
      event.preventDefault();
      select(visible[activeIndex]);
      return;
    }

    if (event.key === "Escape") setOpen(false);
  }

  const optionId = (index: number) => `${listId}-option-${index}`;
  const activeOption = open ? visible[activeIndex] : undefined;

  const message =
    query.trim().length < MIN_TERM_LENGTH
      ? `Escribe al menos ${MIN_TERM_LENGTH} caracteres para buscar.`
      : status === "error"
        ? "No se pudo buscar. Inténtalo de nuevo."
        : visible.length > 0
          ? null
          : status === "searching"
            ? "Buscando…"
            : "Sin resultados.";

  return (
    <div ref={containerRef} className="relative">
      <Input
        {...aria}
        id={id}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeOption ? optionId(activeIndex) : undefined}
        placeholder="Busca por razón social…"
        value={query}
        onChange={(event) => handleChange(event.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border-[1.5px] border-stroke bg-card shadow-[0_12px_32px_rgb(39_35_67/0.18)]">
          {message && (
            <p role="status" className="px-3 py-2.5 text-[13px] text-paragraph">
              {message}
            </p>
          )}

          <ul id={listId} role="listbox" aria-label="Clientes" className="max-h-64 overflow-y-auto">
            {visible.map((customer, index) => (
              <li
                key={customer.id}
                id={optionId(index)}
                role="option"
                aria-selected={index === activeIndex}
                // The input keeps the focus, so the list does not close before
                // the click lands.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(customer)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex cursor-pointer flex-col gap-0.5 px-3 py-2",
                  index === activeIndex && "bg-secondary",
                )}
              >
                <span className="text-[14.5px] font-semibold text-headline">
                  {customer.businessName}
                </span>
                <span className="font-mono text-[12.5px] text-paragraph">
                  {`${IDENTIFICATION_TYPE_LABELS[customer.identificationType]} · ${customer.identification}`}
                </span>
              </li>
            ))}
          </ul>

          {hidden > 0 && (
            <p className="border-t border-headline/10 px-3 py-2 text-[12.5px] text-paragraph">
              {`y ${hidden} más. Escribe un poco más para afinar.`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
