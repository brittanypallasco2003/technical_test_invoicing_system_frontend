import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "ghost-inverse";
type ButtonSize = "md" | "icon";

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-highlight text-headline hover:bg-highlight-hover",
  secondary: "border-[1.5px] border-stroke bg-card text-headline hover:bg-secondary",
  ghost: "text-headline hover:bg-secondary",
  "ghost-inverse": "text-card hover:bg-card/10",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "h-10 px-4 text-[14.5px]",
  icon: "size-10",
};

/** Shared by `Button` and `ButtonLink`, so a link can look like a button. */
export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke",
    "disabled:cursor-not-allowed disabled:opacity-60",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & Omit<ButtonStyleOptions, "className">;

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & Omit<ButtonStyleOptions, "className">;

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}
