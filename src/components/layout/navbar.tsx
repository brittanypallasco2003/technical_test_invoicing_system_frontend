import Link from "next/link";
import { MenuIcon, ReceiptIcon } from "@/components/icons";
import { buttonStyles } from "@/components/ui/button";

interface NavbarProps {
  menuId: string;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export function Navbar({ menuId, isMenuOpen, onToggleMenu }: NavbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 bg-headline px-4">
      <button
        type="button"
        onClick={onToggleMenu}
        aria-controls={menuId}
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Contraer menú" : "Expandir menú"}
        className={buttonStyles({ variant: "ghost-inverse", size: "icon", className: "size-11" })}
      >
        <MenuIcon className="size-5.5" />
      </button>
      <Link href="/facturas" className="flex items-center gap-2.5 rounded-md">
        <span className="flex size-8.5 items-center justify-center rounded-lg bg-highlight text-headline">
          <ReceiptIcon className="size-5" />
        </span>
        <span className="flex items-baseline gap-1.5 text-[17px] font-bold tracking-[0.04em]">
          <span className="text-card">FACTURADOR</span>
          <span className="text-highlight">593</span>
        </span>
      </Link>
    </header>
  );
}
