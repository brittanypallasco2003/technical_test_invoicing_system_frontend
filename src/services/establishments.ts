import type { Establishment, EstablishmentDetail } from "@/types/establishment";
import { apiGet } from "./api-client";

/** `GET /establishments` */
export function listEstablishments(): Promise<Establishment[]> {
  return apiGet<Establishment[]>("/establishments");
}

/** `GET /establishments/:id` */
export function getEstablishment(id: string): Promise<EstablishmentDetail> {
  return apiGet<EstablishmentDetail>(`/establishments/${encodeURIComponent(id)}`);
}
