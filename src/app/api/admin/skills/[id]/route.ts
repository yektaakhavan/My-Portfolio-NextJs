import { eq } from "drizzle-orm";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { badRequest, getCurrentUser, unauthorized } from "@/lib/auth";
import { adminGuard, revalidatePublic } from "@/lib/guard";

export const dynamic = "force-dynamic";

const CATEGORIES = ["frontend", "tools", "soft"];
const LEVELS = ["Advanced", "Intermediate", "Beginner"];

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await params;
  let body: { name?: string; category?: string; level?: string; icon?: string };
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

  const [row] = await db
    .update(skills)
    .set({ name, category, level, icon: (body.icon ?? "").trim() || "spark" })
    .where(eq(skills.id, Number(id)))
    .returning();
  if (!row) return Response.json({ error: "Skill not found" }, { status: 404 });
  revalidatePublic();
  return Response.json({ skill: row });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await params;
  const [row] = await db.delete(skills).where(eq(skills.id, Number(id))).returning();
  if (!row) return Response.json({ error: "Skill not found" }, { status: 404 });
  revalidatePublic();
  return Response.json({ ok: true });
}
