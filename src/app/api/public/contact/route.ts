import { db } from "@/db";
import { messages } from "@/db/schema";
import { badRequest } from "@/lib/auth";
import { gateSubmission, readJson } from "@/lib/submissions";
import { isValidEmail } from "@/lib/utils";
import { cleanText, countLinks } from "@/lib/validators";

export const dynamic = "force-dynamic";

/** Private contact form: goes to the owner's inbox only, never shown publicly. */
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return badRequest("Invalid or too large request.");

  const gate = await gateSubmission(req, body, messages);
  if (!gate.ok) return gate.response;
  if (gate.silent) return Response.json({ ok: true });

  const name = cleanText(body.name, 80);
  const email = cleanText(body.email, 160);
  const phone = cleanText(body.phone, 40);
  const text = cleanText(body.body, 5000);

  if (name.length < 2) return badRequest("Please enter your full name.");
  if (!isValidEmail(email)) return badRequest("Please enter a valid email address.");
  if (text.length < 10) return badRequest("Message should be at least 10 characters.");
  if (body.consent !== true) return badRequest("Please confirm that you agree to the privacy policy.");
  if (countLinks(text) > 3) return badRequest("Please remove some links from your message.");

  await db.insert(messages).values({ name, email, phone, body: text, read: false, ipHash: gate.ipHash });
  return Response.json({ ok: true });
}
