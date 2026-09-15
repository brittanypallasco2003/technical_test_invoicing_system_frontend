import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className }: CardProps) {
  return (
    <section
      className={cn("flex flex-col gap-4 rounded-lg border-[1.5px] border-stroke bg-card p-5", className)}
    >
      <h2 className="text-[15px] font-semibold text-headline">{title}</h2>
      {children}
    </section>
  );
}
