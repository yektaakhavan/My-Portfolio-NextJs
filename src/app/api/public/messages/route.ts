import { db } from "@/db";
import { publicMessages } from "@/db/schema";
import { badRequest } from "@/lib/auth";
import { gateSubmission, readJson } from "@/lib/submissions";
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
  if (!body) return badRequest("Invalid or too large request.");

  const gate = await gateSubmission(req, body, publicMessages);
  if (!gate.ok) return gate.response;
  if (gate.silent) return Response.json({ ok: true, status: "pending" });

  const name = cleanText(body.name, 60);
  const email = cleanText(body.email, 160);
  const text = cleanText(body.body, 800);

  if (name.length < 2) return badRequest("Please enter your name (at least 2 characters).");
  if (email && !isValidEmail(email)) return badRequest("That email address doesn't look right.");
  if (text.length < 10) return badRequest("Your message should be at least 10 characters.");
  if (body.consent !== true) {
    return badRequest("Please agree to the publication of your name and message after review.");
  }
  if (countLinks(text) > 1) return badRequest("To keep the page spam-free, please remove links from your message.");

  await db.insert(publicMessages).values({
    name,
    email,
    body: text,
    status: "pending",
    ipHash: gate.ipHash,
  });
  return Response.json({ ok: true, status: "pending" });
}
