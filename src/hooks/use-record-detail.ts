"use client";

import { useState } from "react";

interface RecordSelection<TRow, TDetail> {
  row: TRow;
  /** Read with `use()` inside a `<Suspense>` boundary. */
  detail: Promise<TDetail>;
}

/**
 * Selection state for a table whose detail is loaded on demand.
 *
 * The request starts in the click handler rather than during render, so the
 * promise stays stable across re-renders and `use()` can suspend on it.
 */
export function useRecordDetail<TRow, TDetail>(loadDetail: (row: TRow) => Promise<TDetail>) {
  const [selection, setSelection] = useState<RecordSelection<TRow, TDetail> | null>(null);

  return {
    selection,
    open: (row: TRow) => setSelection({ row, detail: loadDetail(row) }),
    close: () => setSelection(null),
  };
}
