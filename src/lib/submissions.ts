import { and, count, eq, gte } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { db } from "@/db";
import { sameOrigin } from "./guard";
import { hashIp, clientIp } from "./request";

export type SubmissionGate =
  | { ok: true; ipHash: string; silent: false }
  | { ok: true; ipHash: string; silent: true } // looks like a bot: pretend success, store nothing
  | { ok: false; response: Response };

const json = (error: string, status: number, extra?: HeadersInit) =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json", ...extra },
  });

/**
 * Shared anti-abuse checks for every public form:
 *  - same-origin only, small JSON bodies
 *  - honeypot field ("website") that humans never see
 *  - minimum fill time (bots submit instantly)
 *  - per-IP rate limit stored in the database (hashed IP) so it survives restarts
 */
export async function gateSubmission(
  req: Request,
  body: Record<string, unknown>,
  table: PgTable & { ipHash: PgColumn; createdAt: PgColumn },
  limits = { perHour: 3, perDay: 10 },
): Promise<SubmissionGate> {
  if (!sameOrigin(req)) return { ok: false, response: json("Cross-site request blocked.", 403) };

  const ipHash = hashIp(clientIp(req));

  const honeypot = typeof body.website === "string" && body.website.trim() !== "";
  const started = Number(body.startedAt);
  const tooFast = Number.isFinite(started) && Date.now() - started < 2500;
  if (honeypot || tooFast) return { ok: true, ipHash, silent: true };

  const since = (ms: number) => new Date(Date.now() - ms);
  const [[hour], [day]] = await Promise.all([
    db
      .select({ n: count() })
      .from(table)
      .where(and(eq(table.ipHash, ipHash), gte(table.createdAt, since(3_600_000)))),
    db
      .select({ n: count() })
      .from(table)
      .where(and(eq(table.ipHash, ipHash), gte(table.createdAt, since(86_400_000)))),
  ]);
  if (hour.n >= limits.perHour || day.n >= limits.perDay) {
    return {
      ok: false,
      response: json("You've sent several messages recently. Please try again a bit later.", 429, {
        "Retry-After": "3600",
      }),
    };
  }
  return { ok: true, ipHash, silent: false };
}

export async function readJson(req: Request, maxBytes = 20_000): Promise<Record<string, unknown> | null> {
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > maxBytes) return null;
  try {
    const text = await req.text();
    if (text.length > maxBytes) return null;
    const data = JSON.parse(text);
    return data && typeof data === "object" && !Array.isArray(data) ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
