import { establishmentsMock } from "@/mocks/establishments";
import type { Establishment, EstablishmentDetail } from "@/types/establishment";
import { mockResponse, NotFoundError } from "./mock-response";

/** `GET /establishments` */
export function listEstablishments(): Promise<Establishment[]> {
  return mockResponse(
    establishmentsMock.map(({ id, code, name, address, status }) => ({ id, code, name, address, status })),
  );
}

/** `GET /establishments/:id` */
export async function getEstablishment(id: string): Promise<EstablishmentDetail> {
  const establishment = establishmentsMock.find((candidate) => candidate.id === id);
  if (!establishment) throw new NotFoundError("Establishment", id);
  return mockResponse(establishment);
}
