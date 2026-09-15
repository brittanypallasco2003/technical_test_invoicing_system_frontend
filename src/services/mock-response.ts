/**
 * Resolves like an API call would: asynchronously and with a copy, so callers
 * can never mutate the mock data by accident.
 *
 * Every service goes through here while the API is not wired, which leaves the
 * swap to `fetch` confined to the `services` folder.
 */
export async function mockResponse<T>(data: T): Promise<T> {
  return structuredClone(data);
}

export class NotFoundError extends Error {
  constructor(resource: string, id: string | number) {
    super(`${resource} ${id} not found`);
    this.name = "NotFoundError";
  }
}
