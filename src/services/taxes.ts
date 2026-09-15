import { taxesMock } from "@/mocks/taxes";
import type { Tax } from "@/types/tax";
import { mockResponse } from "./mock-response";

/** `GET /taxes` */
export function listTaxes(): Promise<Tax[]> {
  return mockResponse(taxesMock);
}
