/**
 * Tiny in-memory sliding-window limiter, used for the login endpoint.
 * (Public forms use the database for their limits, so they survive restarts.)
 * If you run several server instances, move this to Redis.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false as const, retryAfter: Math.ceil((windowMs - (now - recent[0]!)) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  }
  return { ok: true as const, retryAfter: 0 };
}

export function resetRateLimit(key: string) {
  hits.delete(key);
}
