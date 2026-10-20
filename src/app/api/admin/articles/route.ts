import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { badRequest, getCurrentUser, unauthorized } from "@/lib/auth";
import { toArticle } from "@/lib/data";
import { adminGuard, revalidatePublic } from "@/lib/guard";
import { parseArticleTranslations, strList } from "@/lib/admin-input";
import { slugify } from "@/lib/utils";
import { cleanText, safeMediaUrl } from "@/lib/validators";

export const dynamic = "force-dynamic";

async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  const root = slugify(base) || "article";
  let slug = root;
  let i = 2;
  for (;;) {
    const [hit] = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, slug)).limit(1);
    if (!hit || hit.id === excludeId) return slug;
    slug = `${root}-${i++}`;
  }
}

function parseDate(v: unknown): Date {
  const d = typeof v === "string" ? new Date(v) : null;
  return d && !Number.isNaN(d.getTime()) ? d : new Date();
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const rows = await db.select().from(articles).orderBy(desc(articles.publishedAt));
  return Response.json({ articles: rows.map(toArticle) });
}

export async function POST(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest("Invalid JSON body");
  const title = cleanText(body.title, 200);
  if (!title) return badRequest("Article title is required.");

  const [row] = await db
    .insert(articles)
    .values({
      title,
      slug: await uniqueSlug(typeof body.slug === "string" && body.slug.trim() ? body.slug : title),
      excerpt: cleanText(body.excerpt, 500),
      content: cleanText(body.content, 60000),
      tags: strList(body.tags, 8, 40),
      coverUrl: safeMediaUrl(body.coverUrl),
      coverAlt: cleanText(body.coverAlt, 200),
      published: body.published !== false,
      publishedAt: parseDate(body.publishedAt),
      translations: parseArticleTranslations(body.translations),
    })
    .returning();
  revalidatePublic();
  return Response.json({ article: toArticle(row!) }, { status: 201 });
}
