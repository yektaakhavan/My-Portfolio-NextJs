import { db } from "@/db";
import { messages } from "@/db/schema";
import { badRequest } from "@/lib/auth";
import { gateSubmission, localeOf, readJson } from "@/lib/submissions";
import { isValidEmail } from "@/lib/utils";
import { cleanText, countLinks } from "@/lib/validators";

export const dynamic = "force-dynamic";

/** Private contact form: goes to the owner's inbox only, never shown publicly. */
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return badRequest(localeOf(null).api.invalidRequest);
  const t = localeOf(body).api;

  const gate = await gateSubmission(req, body, messages);
  if (!gate.ok) return gate.response;
  if (gate.silent) return Response.json({ ok: true });

  const name = cleanText(body.name, 80);
  const email = cleanText(body.email, 160);
  const phone = cleanText(body.phone, 40);
  const text = cleanText(body.body, 5000);

  if (name.length < 2) return badRequest(t.nameContact);
  if (!isValidEmail(email)) return badRequest(t.emailContact);
  if (text.length < 10) return badRequest(t.body);
  if (body.consent !== true) return badRequest(t.consentContact);
  if (countLinks(text) > 3) return badRequest(t.linksContact);

  await db.insert(messages).values({ name, email, phone, body: text, read: false, ipHash: gate.ipHash });
  return Response.json({ ok: true });
}
