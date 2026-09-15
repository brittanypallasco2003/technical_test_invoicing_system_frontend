const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    path: string,
  ) {
    super(`GET ${path} failed with status ${status}`);
    this.name = "ApiError";
  }
}

/**
 * GET against the NestJS API, parsed as JSON.
 *
 * `no-store` because the catalogues live in the database: a prerendered copy
 * taken at `next build` would hide an UPDATE until the next deploy, and would
 * make the build itself depend on the API being up.
 */
export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!response.ok) throw new ApiError(response.status, path);
  return response.json() as Promise<T>;
}
