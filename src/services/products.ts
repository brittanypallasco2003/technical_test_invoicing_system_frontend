import type { Product, ProductAvailability } from "@/types/product";
import { apiGet } from "./api-client";

/** `GET /products` */
export function listProducts(): Promise<Product[]> {
  return apiGet<Product[]>("/products");
}

/** `GET /products/:id` */
export function getProduct(id: string): Promise<Product> {
  return apiGet<Product>(`/products/${encodeURIComponent(id)}`);
}

/**
 * `GET /products/:id/availability?quantity=`
 *
 * A snapshot, not a reservation: someone else can take the last unit before the
 * invoice is issued. It exists to warn while the form is being filled in,
 * instead of ending in a 409 on submit.
 */
export function checkProductAvailability(
  id: string,
  quantity: number,
  signal?: AbortSignal,
): Promise<ProductAvailability> {
  const query = new URLSearchParams({ quantity: String(quantity) });

  return apiGet<ProductAvailability>(
    `/products/${encodeURIComponent(id)}/availability?${query}`,
    signal,
  );
}
