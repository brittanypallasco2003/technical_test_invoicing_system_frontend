import type { ReactNode } from "react";
import { EyeIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { buttonStyles } from "./button";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
  /** Codes, identifiers and amounts. */
  mono?: boolean;
  /** The column that names the row. */
  emphasis?: boolean;
}

interface DataTableProps<T> {
  /** Read by screen readers only. */
  caption: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** Used in the accessible name of the row's detail button. */
  getRowLabel?: (row: T) => string;
  onRowSelect?: (row: T) => void;
  selectedRowId?: string | null;
  emptyMessage?: string;
  size?: "md" | "sm";
}

/**
 * Semantic table with an optional detail action per row.
 *
 * The whole row is clickable for pointer users; the eye button carries the
 * action for keyboard and screen-reader users.
 */
export function DataTable<T>({
  caption,
  columns,
  rows,
  getRowId,
  getRowLabel,
  onRowSelect,
  selectedRowId,
  emptyMessage = "No hay registros.",
  size = "md",
}: DataTableProps<T>) {
  const isCompact = size === "sm";
  const cellPadding = isCompact ? "px-3" : "px-4";

  return (
    <div
      className={cn(
        "overflow-x-auto bg-card",
        isCompact ? "rounded-md border border-headline/25" : "rounded-lg border-[1.5px] border-stroke",
      )}
    >
      <table className={cn("w-full border-collapse text-left", isCompact ? "min-w-120" : "min-w-180")}>
        <caption className="sr-only">{caption}</caption>
        <thead className={cn("bg-tertiary", !isCompact && "border-b-[1.5px] border-stroke")}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={cn(
                  cellPadding,
                  "font-semibold tracking-[0.08em] text-headline uppercase",
                  isCompact ? "h-9 text-[11px]" : "h-11 text-[11.5px]",
                  column.align === "right" && "text-right",
                )}
              >
                {column.header}
              </th>
            ))}
            {onRowSelect && (
              <th scope="col" className="w-16">
                <span className="sr-only">Acciones</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onRowSelect ? 1 : 0)}
                className="h-24 text-center text-[14.5px] text-paragraph"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => {
              const rowId = getRowId(row);
              const isSelected = rowId === selectedRowId;

              return (
                <tr
                  key={rowId}
                  onClick={onRowSelect ? () => onRowSelect(row) : undefined}
                  className={cn(
                    isCompact ? "h-11 border-t border-headline/10 first:border-t-0" : "h-13",
                    isSelected ? "bg-highlight-soft" : index % 2 === 1 && !isCompact ? "bg-zebra" : "bg-card",
                    onRowSelect && "cursor-pointer hover:bg-secondary",
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        cellPadding,
                        column.align === "right" && "text-right",
                        column.mono ? "font-mono text-[13.5px] whitespace-nowrap" : "text-[14.5px]",
                        column.emphasis ? "font-semibold text-headline" : "text-paragraph",
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                  {onRowSelect && (
                    <td className="px-2 text-center">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onRowSelect(row);
                        }}
                        aria-label={getRowLabel ? `Ver detalle de ${getRowLabel(row)}` : "Ver detalle"}
                        title="Ver detalle"
                        className={buttonStyles({ variant: "ghost", size: "icon", className: "size-9" })}
                      >
                        <EyeIcon className="size-5" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
