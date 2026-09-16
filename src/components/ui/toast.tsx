"use client";

import { useEffect } from "react";
import { CloseIcon } from "@/components/icons";
import { buttonStyles } from "./button";

/** Long enough to read twice, short enough not to sit there. */
const AUTO_HIDE_MS = 7000;

interface ToastProps {
  title: string;
  description?: string;
  /** Must be stable, or the timer restarts on every render. */
  onDismiss: () => void;
}

/**
 * Confirmation that does not take the screen.
 *
 * Not a `<dialog>`: this one announces something that already happened, so it
 * floats over a corner, leaves the page usable underneath and goes away on its
 * own. `aria-live="polite"` is what makes a screen reader say it without
 * interrupting whatever the user is doing.
 */
export function Toast({ title, description, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end p-4 sm:p-6">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto flex w-full max-w-100 items-start gap-3 rounded-lg border-[1.5px] border-stroke bg-card p-4 shadow-[0_16px_40px_rgb(39_35_67/0.22)] motion-safe:animate-pop-in"
      >
        <span aria-hidden="true" className="mt-1.5 size-2.5 shrink-0 rounded-full bg-success" />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-[14.5px] font-semibold text-headline">{title}</p>
          {description && <p className="text-[13px] leading-snug text-paragraph">{description}</p>}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Cerrar aviso"
          className={buttonStyles({ variant: "ghost", size: "icon", className: "-my-1 -mr-1.5 ml-auto size-8" })}
        >
          <CloseIcon className="size-4.5" />
        </button>
      </div>
    </div>
  );
}
