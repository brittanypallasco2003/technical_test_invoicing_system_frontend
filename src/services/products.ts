import { productsMock } from "@/mocks/products";
import type { Product } from "@/types/product";
import { mockResponse, NotFoundError } from "./mock-response";

/**
 * Product listing.
 *
 * The API does not expose `GET /products` yet (only `GET /products/:id`).
 */
export function listProducts(): Promise<Product[]> {
  return mockResponse(productsMock);
}

/** `GET /products/:id` */
export async function getProduct(id: string): Promise<Product> {
  const product = productsMock.find((candidate) => candidate.id === id);
  if (!product) throw new NotFoundError("Product", id);
  return mockResponse(product);
}
