import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const controlClasses = cn(
  "h-10 w-full min-w-0 rounded-md border bg-card px-2.5 text-[14.5px] text-headline",
  "border-headline/40 focus-visible:border-stroke focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-highlight",
  "disabled:cursor-not-allowed disabled:bg-secondary disabled:text-paragraph",
  "aria-invalid:border-danger aria-invalid:bg-danger-soft/40",
);

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlClasses, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(controlClasses, "pr-8", className)} {...props} />;
}

interface FieldProps {
  label: string;
  htmlFor: string;
  /** Pass the same id to the control's `aria-describedby`. */
  errorId?: string;
  error?: string;
  hideLabel?: boolean;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, errorId, hideLabel, children }: FieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className={cn("text-[12.5px] font-medium text-paragraph", hideLabel && "sr-only")}
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} className="text-[12.5px] font-medium text-danger-strong">
          {error}
        </p>
      )}
    </div>
  );
}

/** Read-only value laid out like a field, for data the user cannot edit. */
export function StaticField({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[12.5px] font-medium text-paragraph">{label}</span>
      <span
        className={cn(
          "flex h-10 items-center rounded-md bg-secondary px-2.5 text-paragraph",
          mono ? "font-mono text-[13.5px]" : "text-[14.5px]",
        )}
      >
        {value}
      </span>
    </div>
  );
}
