import { asc, max } from "drizzle-orm";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { badRequest, getCurrentUser, unauthorized } from "@/lib/auth";
import { adminGuard, revalidatePublic } from "@/lib/guard";
import { parseSkillTranslations } from "@/lib/admin-input";

export const dynamic = "force-dynamic";

const CATEGORIES = ["frontend", "tools", "soft"];
const LEVELS = ["Advanced", "Intermediate", "Beginner"];

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const rows = await db.select().from(skills).orderBy(asc(skills.sort), asc(skills.id));
  return Response.json({ skills: rows });
}

export async function POST(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  let body: { name?: string; category?: string; level?: string; icon?: string; translations?: unknown };
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const name = (body.name ?? "").trim();
  const category = (body.category ?? "").trim();
  const level = (body.level ?? "").trim();
  if (!name) return badRequest("Skill name is required.");
  if (!CATEGORIES.includes(category)) return badRequest("Invalid category.");
  if (!LEVELS.includes(level)) return badRequest("Invalid level.");

  const [top] = await db.select({ m: max(skills.sort) }).from(skills);
  const [row] = await db
    .insert(skills)
    .values({
      name,
      category,
      level,
      translations: parseSkillTranslations(body.translations),
      icon: (body.icon ?? "").trim() || "spark",
      sort: (top?.m ?? 0) + 1,
    })
    .returning();
  revalidatePublic();
  return Response.json({ skill: row }, { status: 201 });
}
