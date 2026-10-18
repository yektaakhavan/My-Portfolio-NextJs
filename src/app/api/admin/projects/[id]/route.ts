import { eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { badRequest } from "@/lib/auth";
import { toProject } from "@/lib/data";
import { adminGuard, revalidatePublic } from "@/lib/guard";
import { mergeTranslations, parseImages, parseProjectTranslations, strList } from "@/lib/admin-input";
import { cleanText, safeHttpUrl } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const [existing] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, Number(id)))
    .limit(1);
  if (!existing) return Response.json({ error: "Project not found" }, { status: 404 });

  const title = String(body.title ?? existing.title).trim();
  if (!title) return badRequest("Project title is required.");

  let slug = existing.slug;
  if (title !== existing.title) {
    const base = slugify(title) || "project";
    slug = base;
    let i = 2;
    for (;;) {
      const [hit] = await db
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.slug, slug))
        .limit(1);
      if (!hit || hit.id === existing.id) break;
      slug = `${base}-${i++}`;
    }
  }

  const [row] = await db
    .update(projects)
    .set({
      title,
      slug,
      description: String(body.description ?? existing.description).trim(),
      // only touched when the write-up editor sends it, so editing other fields never wipes the write-up
      details: "details" in body ? cleanText(body.details, 20000) : existing.details,
      translations: "translations" in body ? mergeTranslations(existing.translations, parseProjectTranslations(body.translations)) : existing.translations,
      tags: Array.isArray(body.tags) ? strList(body.tags, 12, 40) : existing.tags,
      tech: Array.isArray(body.tech) ? strList(body.tech, 20, 40) : existing.tech,
      liveUrl: "liveUrl" in body ? safeHttpUrl(body.liveUrl) : existing.liveUrl,
      githubUrl: "githubUrl" in body ? safeHttpUrl(body.githubUrl) : existing.githubUrl,
      images: Array.isArray(body.images) ? parseImages(body.images) : existing.images,
      accent: Number(body.accent ?? existing.accent) % 5,
      featured: Boolean(body.featured ?? existing.featured),
    })
    .where(eq(projects.id, existing.id))
    .returning();
  revalidatePublic();
  return Response.json({ project: toProject(row) });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await params;
  const [row] = await db
    .delete(projects)
    .where(eq(projects.id, Number(id)))
    .returning();
  if (!row) return Response.json({ error: "Project not found" }, { status: 404 });
  revalidatePublic();
  return Response.json({ ok: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // Reorder: body { sort }
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { sort?: number };
  if (typeof body.sort !== "number") return badRequest("sort is required");
  const [row] = await db
    .update(projects)
    .set({ sort: body.sort })
    .where(eq(projects.id, Number(id)))
    .returning();
  if (!row) return Response.json({ error: "Project not found" }, { status: 404 });
  revalidatePublic();
  return Response.json({ project: toProject(row) });
}
