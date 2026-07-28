export const INGEST_USER_AGENT = "Mozilla/5.0 (compatible; worldcompare-ingest/1.0)";

/**
 * Some hosts are reachable from this pipeline's network only in bursts —
 * often instant, occasionally hanging for tens of seconds at a time. Many
 * short-timeout attempts ride out a bad window far more reliably than a few
 * long ones.
 */
export async function fetchWithRetry(
  url: string,
  init: RequestInit = {},
  attempts = 20,
  timeoutMs = 10000
): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        ...init,
        headers: { "User-Agent": INGEST_USER_AGENT, ...init.headers },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, Math.min(500 * (i + 1), 3000)));
    }
  }
  throw new Error(`Failed after ${attempts} attempts: ${url}\n${String(lastError)}`);
}
