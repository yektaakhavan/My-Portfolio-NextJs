import { createHash } from "node:crypto";

/** Best-effort client IP (works behind nginx / Vercel / Cloudflare style proxies). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function secret(): string {
  return (
    process.env.IP_HASH_SECRET ||
    // Fallback so the site works out of the box; set IP_HASH_SECRET in production.
    createHash("sha256").update(process.env.DATABASE_URL ?? "dev").digest("hex")
  );
}

/**
 * We never store raw IP addresses. A salted hash is enough to rate-limit abuse
 * and is documented in the privacy policy.
 */
export function hashIp(ip: string): string {
  return createHash("sha256").update(`${secret()}:${ip}`).digest("hex").slice(0, 32);
}
