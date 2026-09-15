import {
  BoxIcon,
  FileTextIcon,
  PercentIcon,
  StoreIcon,
  UsersIcon,
  type IconComponent,
} from "@/components/icons";

export interface NavItem {
  href: string;
  label: string;
  icon: IconComponent;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/impuestos", label: "Impuestos", icon: PercentIcon },
  { href: "/establecimientos", label: "Establecimientos", icon: StoreIcon },
  { href: "/clientes", label: "Clientes", icon: UsersIcon },
  { href: "/productos", label: "Productos", icon: BoxIcon },
  { href: "/facturas", label: "Facturas", icon: FileTextIcon },
];

/** `/facturas/nueva` keeps "Facturas" highlighted. */
export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
