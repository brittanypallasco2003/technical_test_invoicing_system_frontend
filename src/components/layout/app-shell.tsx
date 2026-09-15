"use client";

import { useState, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Navbar } from "./navbar";
import { DesktopSidebar, MobileSidebar } from "./sidebar";

const DESKTOP_QUERY = "(min-width: 64rem)";
const DESKTOP_MENU_ID = "menu-principal";
const MOBILE_MENU_ID = "menu-principal-movil";

/**
 * Navbar + sidebar around every section.
 *
 * On desktop the menu stays open while navigating and collapses to icons on
 * demand; on smaller screens it opens as a drawer. `children` are still
 * rendered on the server: only the shell is a Client Component.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY, true);
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  function toggleMenu() {
    if (isDesktop) setIsDesktopExpanded((expanded) => !expanded);
    else setIsMobileOpen((open) => !open);
  }

  return (
    <div className="flex h-full flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-highlight focus:px-3 focus:py-2 focus:font-semibold"
      >
        Saltar al contenido
      </a>
      <Navbar
        menuId={isDesktop ? DESKTOP_MENU_ID : MOBILE_MENU_ID}
        isMenuOpen={isDesktop ? isDesktopExpanded : isMobileOpen}
        onToggleMenu={toggleMenu}
      />
      <div className="flex min-h-0 flex-1">
        <DesktopSidebar
          id={DESKTOP_MENU_ID}
          expanded={isDesktopExpanded}
          onCollapse={() => setIsDesktopExpanded(false)}
        />
        <MobileSidebar
          id={MOBILE_MENU_ID}
          open={isMobileOpen && !isDesktop}
          onClose={() => setIsMobileOpen(false)}
        />
        <main id="contenido" className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
