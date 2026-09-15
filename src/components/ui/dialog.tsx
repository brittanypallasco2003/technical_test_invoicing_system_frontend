"use client";

import { useId, type MouseEvent, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { useModalDialog } from "@/hooks/use-modal-dialog";
import { cn } from "@/lib/cn";
import { buttonStyles } from "./button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Small label above the title, e.g. the record type. */
  eyebrow?: ReactNode;
  /** Rendered next to the title, e.g. a status badge. */
  meta?: ReactNode;
  children: ReactNode;
}

interface DialogShellProps extends DialogProps {
  className: string;
}

function DialogShell({ open, onClose, title, eyebrow, meta, children, className }: DialogShellProps) {
  const dialogRef = useModalDialog(open);
  const titleId = useId();

  // A click whose target is the <dialog> itself landed on the backdrop.
  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
      className={cn(
        "flex-col overflow-hidden bg-card p-0 text-headline backdrop:bg-headline/40 open:flex",
        className,
      )}
    >
      <header className="flex shrink-0 items-start justify-between gap-4 bg-headline py-5 pr-4 pl-6">
        <div className="flex min-w-0 flex-col gap-1.5">
          {eyebrow && (
            <p className="text-[11.5px] font-semibold tracking-[0.08em] text-tertiary uppercase">
              {eyebrow}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <h2 id={titleId} className="text-xl leading-snug font-semibold text-card">
              {title}
            </h2>
            {meta}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className={buttonStyles({ variant: "ghost-inverse", size: "icon" })}
        >
          <CloseIcon className="size-5.5" />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-6 pb-8">{children}</div>
    </dialog>
  );
}

interface ModalProps extends DialogProps {
  size?: "md" | "lg";
}

/** Centered dialog for short records. */
export function Modal({ size = "md", ...props }: ModalProps) {
  return (
    <DialogShell
      {...props}
      className={cn(
        "m-auto max-h-[min(820px,calc(100dvh-2rem))] w-[calc(100%-2rem)] rounded-[10px] border-[1.5px] border-stroke shadow-[0_24px_64px_rgb(39_35_67/0.3)] motion-safe:animate-pop-in",
        size === "lg" ? "max-w-170" : "max-w-140",
      )}
    />
  );
}

/** Dialog anchored to the right edge for long records such as invoices. */
export function SlideOver(props: DialogProps) {
  return (
    <DialogShell
      {...props}
      className="my-0 mr-0 ml-auto h-dvh max-h-dvh w-full max-w-160 border-l-[1.5px] border-stroke motion-safe:animate-slide-in"
    />
  );
}
