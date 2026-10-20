import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { badRequest } from "@/lib/auth";
import { toArticle } from "@/lib/data";
import { adminGuard, revalidatePublic } from "@/lib/guard";
import { mergeTranslations, parseArticleTranslations, strList } from "@/lib/admin-input";
import { slugify } from "@/lib/utils";
import { cleanText, safeMediaUrl } from "@/lib/validators";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n)) return badRequest("Invalid id");
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest("Invalid JSON body");

  const [existing] = await db.select().from(articles).where(eq(articles.id, n)).limit(1);
  if (!existing) return Response.json({ error: "Article not found" }, { status: 404 });

  const title = "title" in body ? cleanText(body.title, 200) : existing.title;
  if (!title) return badRequest("Article title is required.");

  // a changed slug must stay unique (and URL-safe)
  let slug = existing.slug;
  if (typeof body.slug === "string" && body.slug.trim()) {
    const wanted = slugify(body.slug) || existing.slug;
    if (wanted !== existing.slug) {
      const [clash] = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, wanted)).limit(1);
      if (clash && clash.id !== n) return badRequest("That address (slug) is already used by another article.");
      slug = wanted;
    }
  }

  const when = typeof body.publishedAt === "string" ? new Date(body.publishedAt) : null;
  const [row] = await db
    .update(articles)
    .set({
      title,
      slug,
      excerpt: "excerpt" in body ? cleanText(body.excerpt, 500) : existing.excerpt,
      content: "content" in body ? cleanText(body.content, 60000) : existing.content,
      tags: Array.isArray(body.tags) ? strList(body.tags, 8, 40) : existing.tags,
      coverUrl: "coverUrl" in body ? safeMediaUrl(body.coverUrl) : existing.coverUrl,
      coverAlt: "coverAlt" in body ? cleanText(body.coverAlt, 200) : existing.coverAlt,
      published: "published" in body ? body.published !== false : existing.published,
      publishedAt: when && !Number.isNaN(when.getTime()) ? when : existing.publishedAt,
      translations: "translations" in body ? mergeTranslations(existing.translations, parseArticleTranslations(body.translations)) : existing.translations,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, n))
    .returning();
  revalidatePublic();
  return Response.json({ article: toArticle(row!) });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n)) return badRequest("Invalid id");
  const [row] = await db.delete(articles).where(eq(articles.id, n)).returning();
  if (!row) return Response.json({ error: "Article not found" }, { status: 404 });
  revalidatePublic();
  return Response.json({ ok: true });
}
