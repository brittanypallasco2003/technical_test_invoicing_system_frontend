import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "success" | "neutral" | "warning" | "danger";

const TONE_CLASSES: Record<BadgeTone, { badge: string; dot: string }> = {
  success: { badge: "border-tertiary bg-secondary text-headline", dot: "bg-success" },
  neutral: { badge: "border-headline/25 bg-card text-paragraph", dot: "bg-headline/35" },
  warning: { badge: "border-highlight bg-highlight-soft text-headline", dot: "bg-warning" },
  danger: { badge: "border-danger-border bg-danger-soft text-danger-strong", dot: "bg-danger" },
};

interface BadgeProps {
  tone: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-md border px-2 text-[12.5px] font-semibold whitespace-nowrap",
        TONE_CLASSES[tone].badge,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", TONE_CLASSES[tone].dot)} />
      {children}
    </span>
  );
}
