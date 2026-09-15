/**
 * Row status as the API returns it.
 *
 * The backend enum also has `DELETED`, but soft-deleted rows are filtered out
 * of every query, so a response only ever carries these two values.
 */
export const Status = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;
export type Status = (typeof Status)[keyof typeof Status];

/** Table 6 of the SRI. */
export const IdentificationType = {
  RUC: "04",
  CEDULA: "05",
  PASAPORTE: "06",
  VENTA_A_CONSUMIDOR_FINAL: "07",
  IDENTIFICACION_DEL_EXTERIOR: "08",
} as const;
export type IdentificationType =
  (typeof IdentificationType)[keyof typeof IdentificationType];

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
