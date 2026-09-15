"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ChevronsLeftIcon, CloseIcon } from "@/components/icons";
import { buttonStyles } from "@/components/ui/button";
import { useModalDialog } from "@/hooks/use-modal-dialog";
import { cn } from "@/lib/cn";
import { isNavItemActive, NAV_ITEMS } from "./navigation";

interface SidebarNavProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal">
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = isNavItemActive(pathname, href);

          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-lg px-3 text-[15px] whitespace-nowrap transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke",
                  collapsed && "justify-center",
                  isActive
                    ? "bg-headline font-semibold text-card"
                    : "font-medium text-paragraph hover:bg-secondary",
                )}
              >
                <Icon className={cn("size-5 shrink-0", isActive ? "text-highlight" : "text-headline")} />
                <span className={cn(collapsed && "sr-only")}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between pl-3">
      <span className="text-[11.5px] font-semibold tracking-[0.08em] text-paragraph uppercase">Menú</span>
      {children}
    </div>
  );
}

interface DesktopSidebarProps {
  id: string;
  expanded: boolean;
  onCollapse: () => void;
}

/** From `lg` up: pushes the content and collapses to an icon rail. */
export function DesktopSidebar({ id, expanded, onCollapse }: DesktopSidebarProps) {
  return (
    <aside
      id={id}
      className={cn(
        "hidden shrink-0 flex-col gap-1 overflow-hidden border-r-2 border-stroke bg-card p-3 lg:flex",
        "transition-[width] duration-200 ease-out motion-reduce:transition-none",
        expanded ? "w-62" : "w-18",
      )}
    >
      {expanded && (
        <SidebarHeading>
          <button
            type="button"
            onClick={onCollapse}
            aria-controls={id}
            aria-label="Contraer menú"
            title="Contraer menú"
            className={buttonStyles({ variant: "ghost", size: "icon" })}
          >
            <ChevronsLeftIcon className="size-5" />
          </button>
        </SidebarHeading>
      )}
      <SidebarNav collapsed={!expanded} />
    </aside>
  );
}

interface MobileSidebarProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

/** Below `lg`: a modal drawer, so it never squeezes the table. */
export function MobileSidebar({ id, open, onClose }: MobileSidebarProps) {
  const dialogRef = useModalDialog(open);

  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-label="Menú"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="my-0 mr-auto ml-0 h-dvh max-h-dvh w-72 max-w-[calc(100%-3rem)] flex-col gap-1 border-r-2 border-stroke bg-card p-3 backdrop:bg-headline/40 open:flex motion-safe:animate-slide-in lg:hidden"
    >
      <SidebarHeading>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className={buttonStyles({ variant: "ghost", size: "icon" })}
        >
          <CloseIcon className="size-5" />
        </button>
      </SidebarHeading>
      <SidebarNav onNavigate={onClose} />
    </dialog>
  );
}
