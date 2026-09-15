/**
 * Neon's serverless WebSocket Pool intermittently throws ETIMEDOUT /
 * connection-reset errors on an otherwise-healthy connection (compute
 * autosuspend wake-up, a dropped pooler socket, etc). The failing query
 * almost always succeeds immediately on a fresh connection, so retrying
 * once is far cheaper than surfacing a 500 to the user.
 *
 * Used around the auth check in lib/auth.ts, which runs on every single
 * page load via the (dashboard)/onboarding layouts and is therefore the
 * highest-traffic, most visibly-impacted call site.
 */
const BACKOFF_MS = [400, 1200, 2500];

export async function withDbRetry<T>(fn: () => Promise<T>, retries = BACKOFF_MS.length): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, BACKOFF_MS[attempt] ?? 2500));
      }
    }
  }

  throw lastError;
}
