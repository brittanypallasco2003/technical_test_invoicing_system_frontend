"use client";

import { useEffect, useRef } from "react";

/**
 * Keeps a native `<dialog>` in sync with an `open` flag.
 *
 * `showModal()` gives focus trapping, Escape to close, the top layer and an
 * inert background for free, so no focus-trap library is needed.
 */
export function useModalDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return ref;
}
