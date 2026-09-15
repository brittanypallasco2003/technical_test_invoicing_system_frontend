import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeftIcon } from "@/components/icons";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  back?: { href: string; label: string };
}

export function PageHeader({ title, description, actions, back }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-2.5">
      {back && (
        <Link
          href={back.href}
          className="inline-flex h-7 items-center gap-1.5 self-start text-[13.5px] font-semibold text-paragraph hover:underline"
        >
          <ArrowLeftIcon className="size-4.5" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-[26px] leading-tight font-semibold text-headline">{title}</h1>
          {description && <p className="text-sm text-paragraph">{description}</p>}
        </div>
        {actions}
      </div>
    </header>
  );
}
