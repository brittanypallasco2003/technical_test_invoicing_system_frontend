import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface DescriptionItem {
  label: string;
  value: ReactNode;
  mono?: boolean;
  fullWidth?: boolean;
}

export function DescriptionList({ items }: { items: DescriptionItem[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn("flex min-w-0 flex-col gap-1", item.fullWidth && "sm:col-span-2")}
        >
          <dt className="text-[12.5px] font-medium text-paragraph">{item.label}</dt>
          <dd
            className={cn(
              "leading-snug text-headline",
              item.mono ? "font-mono text-[13.5px] break-all" : "text-[14.5px]",
            )}
          >
            {item.value ?? "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3.5">
      <h3 className="text-[11.5px] font-semibold tracking-[0.08em] text-paragraph uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function DetailBody({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-7">{children}</div>;
}

export function DetailSkeleton() {
  return (
    <div role="status" className="flex animate-pulse flex-col gap-4">
      <span className="sr-only">Cargando detalle…</span>
      <div className="h-3 w-24 rounded bg-secondary" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="h-3 w-20 rounded bg-secondary" />
            <div className="h-4 w-36 rounded bg-secondary" />
          </div>
        ))}
      </div>
    </div>
  );
}
