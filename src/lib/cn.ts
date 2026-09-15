type ClassValue = string | false | null | undefined;

/** Joins the truthy class names, so conditional classes read inline. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
