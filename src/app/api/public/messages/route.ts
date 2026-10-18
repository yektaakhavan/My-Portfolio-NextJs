import { db } from "@/db";
import { publicMessages } from "@/db/schema";
import { badRequest } from "@/lib/auth";
import { gateSubmission, localeOf, readJson } from "@/lib/submissions";
import { isValidEmail } from "@/lib/utils";
import { cleanText, countLinks } from "@/lib/validators";

export const dynamic = "force-dynamic";

/**
 * Public "leave a message" form.
 * Everything is saved as status = "pending" and is INVISIBLE until the owner approves it
 * in Admin → Moderation.
 */
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return badRequest(localeOf(null).api.invalidRequest);
  const t = localeOf(body).api;

  const gate = await gateSubmission(req, body, publicMessages);
  if (!gate.ok) return gate.response;
  if (gate.silent) return Response.json({ ok: true, status: "pending" });

  const name = cleanText(body.name, 60);
  const email = cleanText(body.email, 160);
  const text = cleanText(body.body, 800);

  if (name.length < 2) return badRequest(t.namePublic);
  if (email && !isValidEmail(email)) return badRequest(t.emailPublic);
  if (text.length < 10) return badRequest(t.body);
  if (body.consent !== true) {
    return badRequest(t.consentPublic);
  }
  if (countLinks(text) > 1) return badRequest(t.linksPublic);

  await db.insert(publicMessages).values({
    name,
    email,
    body: text,
    status: "pending",
    ipHash: gate.ipHash,
  });
  return Response.json({ ok: true, status: "pending" });
}
