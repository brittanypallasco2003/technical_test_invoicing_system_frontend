import { API_PROXY_PATH, API_URL } from "@/lib/api-config";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    method: string,
    path: string,
    /** What the API said, when it said something a person can act on. */
    readonly detail: string | null,
  ) {
    super(detail ?? `${method} ${path} failed with status ${status}`);
    this.name = "ApiError";
  }
}

/**
 * The server talks to the API directly; the browser goes through the
 * same-origin rewrite in `next.config.ts`, because the API does not enable CORS.
 */
function baseUrl(): string {
  return typeof window === "undefined" ? API_URL : API_PROXY_PATH;
}

/**
 * The `message` Nest puts in an error body, which is a string for the ones the
 * use cases throw and an array for the ones the validation pipe does.
 *
 * A body that is not the expected JSON is not an error worth reporting on top of
 * the one that is already being handled, so it yields the generic message.
 */
async function errorDetail(response: Response): Promise<string | null> {
  try {
    const body: unknown = await response.json();
    const message = (body as { message?: unknown }).message;

    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(". ");
    return null;
  } catch {
    return null;
  }
}

async function request<T>(method: "GET" | "POST", path: string, init?: RequestInit): Promise<T> {
  // `no-store` because the data lives in the database: a copy taken at
  // `next build` would hide an UPDATE until the next deploy, and would make the
  // build itself depend on the API being up.
  const response = await fetch(`${baseUrl()}${path}`, { method, cache: "no-store", ...init });

  if (!response.ok) {
    throw new ApiError(response.status, method, path, await errorDetail(response));
  }

  return response.json() as Promise<T>;
}

/** GET against the NestJS API, parsed as JSON. */
export function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  return request<T>("GET", path, { signal });
}

/** POST against the NestJS API, sending and parsing JSON. */
export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>("POST", path, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
