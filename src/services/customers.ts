import type { Customer, CustomerDetail } from "@/types/customer";
import { apiGet } from "./api-client";

/**
 * `GET /customers`, or `GET /customers?businessName=perez` when a term is given.
 *
 * The API matches a name that CONTAINS the term, without regard to case, and
 * answers an empty array when nothing matches.
 */
export function listCustomers(businessName?: string, signal?: AbortSignal): Promise<Customer[]> {
  const term = businessName?.trim();
  const query = term ? `?${new URLSearchParams({ businessName: term })}` : "";

  return apiGet<Customer[]>(`/customers${query}`, signal);
}

/** `GET /customers/:id` */
export function getCustomer(id: string): Promise<CustomerDetail> {
  return apiGet<CustomerDetail>(`/customers/${encodeURIComponent(id)}`);
}
