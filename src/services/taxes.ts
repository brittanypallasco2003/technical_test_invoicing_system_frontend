import type { Tax } from "@/types/tax";
import { apiGet } from "./api-client";

/** `GET /taxes` */
export function listTaxes(): Promise<Tax[]> {
  return apiGet<Tax[]>("/taxes");
}
