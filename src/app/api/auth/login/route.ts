import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, SESSION_COOKIE, sessionCookieOptions, verifyPassword } from "@/lib/auth";
import { sameOrigin } from "@/lib/guard";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";

export const dynamic = "force-dynamic";

// A real hash of a random password: lets us spend the same time for unknown e-mails (no user enumeration).
const DUMMY_HASH =
  "00000000000000000000000000000000:" + "0".repeat(128);

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ error: "Cross-site request blocked." }, { status: 403 });

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase().slice(0, 200);
  const password = (body.password ?? "").slice(0, 200);
  if (!email || !password) {
    return Response.json({ error: "Email and password are required" }, { status: 400 });
  }

  const ip = clientIp(req);
  const byIp = rateLimit(`login:ip:${ip}`, 10, 15 * 60_000);
  const byEmail = rateLimit(`login:email:${email}`, 6, 15 * 60_000);
  if (!byIp.ok || !byEmail.ok) {
    const retry = Math.max(byIp.retryAfter, byEmail.retryAfter);
    return Response.json(
      { error: "Too many sign-in attempts. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(retry) } },
    );
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const valid = verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  resetRateLimit(`login:email:${email}`);
  const token = await createSession(user.id);
  const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
