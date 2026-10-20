import { readFile } from "node:fs/promises";
import path from "node:path";
import { db } from "./index";
import { articles } from "./schema";

type Meta = {
  slug: string;
  publishedAt: string;
  tags: string[];
  title: string;
  excerpt: string;
  coverAlt: string;
  fa: { tags: string[]; title: string; excerpt: string; coverAlt: string };
};

const DIR = path.join(process.cwd(), "src/content/blog");

/**
 * Adds the sample articles (English + Persian, with generated cover images).
 * SAFE to run any time: an article whose slug already exists is left untouched, so your edits are never overwritten.
 */
export async function seedArticles(): Promise<{ added: number; skipped: number }> {
  const metas = JSON.parse(await readFile(path.join(DIR, "meta.json"), "utf8")) as Meta[];
  let added = 0;
  for (const m of metas) {
    const [en, fa] = await Promise.all([readFile(path.join(DIR, `${m.slug}.en.md`), "utf8"), readFile(path.join(DIR, `${m.slug}.fa.md`), "utf8")]);
    const rows = await db
      .insert(articles)
      .values({
        slug: m.slug,
        title: m.title,
        excerpt: m.excerpt,
        content: en.trim(),
        tags: m.tags,
        coverUrl: `/images/blog/${m.slug}-1600.webp`,
        coverAlt: m.coverAlt,
        published: true,
        publishedAt: new Date(`${m.publishedAt}T12:00:00`),
        translations: { fa: { title: m.fa.title, excerpt: m.fa.excerpt, tags: m.fa.tags, coverAlt: m.fa.coverAlt, content: fa.trim() } },
      })
      .onConflictDoNothing({ target: articles.slug })
      .returning({ id: articles.id });
    added += rows.length;
  }
  return { added, skipped: metas.length - added };
}
