import { asc, eq, max } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { badRequest, getCurrentUser, unauthorized } from "@/lib/auth";
import { toProject } from "@/lib/data";
import { adminGuard, revalidatePublic } from "@/lib/guard";
import { parseImages, parseProjectTranslations, strList } from "@/lib/admin-input";
import { cleanText, safeHttpUrl } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const rows = await db.select().from(projects).orderBy(asc(projects.sort), asc(projects.id));
  return Response.json({ projects: rows.map(toProject) });
}

async function uniqueSlug(title: string, excludeId?: number): Promise<string> {
  const base = slugify(title) || "project";
  let slug = base;
  let i = 2;
  for (;;) {
    const [hit] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.slug, slug))
      .limit(1);
    if (!hit || hit.id === excludeId) return slug;
    slug = `${base}-${i++}`;
  }
}

export async function POST(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  if (!title) return badRequest("Project title is required.");
  if (!description) return badRequest("Description is required.");

  const [top] = await db.select({ m: max(projects.sort) }).from(projects);
  const [row] = await db
    .insert(projects)
    .values({
      title,
      description,
      details: cleanText(body.details, 20000),
      translations: parseProjectTranslations(body.translations),
      slug: await uniqueSlug(title),
      tags: strList(body.tags, 12, 40),
      tech: strList(body.tech, 20, 40),
      liveUrl: safeHttpUrl(body.liveUrl),
      githubUrl: safeHttpUrl(body.githubUrl),
      images: parseImages(body.images),
      accent: Number(body.accent ?? 0) % 5,
      featured: Boolean(body.featured),
      sort: (top?.m ?? 0) + 1,
    })
    .returning();
  revalidatePublic();
  return Response.json({ project: toProject(row) }, { status: 201 });
}
