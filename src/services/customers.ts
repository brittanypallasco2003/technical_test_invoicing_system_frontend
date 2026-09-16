import type { Customer, CustomerDetail } from "@/types/customer";
import { apiGet } from "./api-client";

/** `GET /customers` */
export function listCustomers(): Promise<Customer[]> {
  return apiGet<Customer[]>("/customers");
}

/** `GET /customers/:id` */
export function getCustomer(id: string): Promise<CustomerDetail> {
  return apiGet<CustomerDetail>(`/customers/${encodeURIComponent(id)}`);
}
