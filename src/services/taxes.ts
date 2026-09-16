import type { Tax } from "@/types/tax";
import { apiGet } from "./api-client";

/** `GET /taxes` */
export function listTaxes(): Promise<Tax[]> {
  return apiGet<Tax[]>("/taxes");
}

/**
 * `GET /taxes/:id`
 *
 * The id is a number, not a UUID: the tax catalogue is closed and seeded, so it
 * is the one table keyed by an auto-incrementing integer.
 */
export function getTax(id: number): Promise<Tax> {
  return apiGet<Tax>(`/taxes/${id}`);
}
