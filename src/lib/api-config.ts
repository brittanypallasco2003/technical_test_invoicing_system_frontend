/** Imported by `next.config.ts` too, so keep it free of `@/` imports. */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

/** Same-origin prefix that `next.config.ts` rewrites to `API_URL`. */
export const API_PROXY_PATH = "/api";
