/**
 * Resolves like an API call would: asynchronously and with a copy, so callers
 * can never mutate the mock data by accident.
 *
 * Services whose endpoint is not wired yet go through here, which leaves the
 * swap to `apiGet` confined to the `services` folder.
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
