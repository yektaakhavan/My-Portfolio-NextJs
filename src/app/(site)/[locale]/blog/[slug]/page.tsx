import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard, ArticleMeta } from "@/components/article-card";
import { Icon } from "@/components/icons";
import { LocaleLink } from "@/components/locale-link";
import { MarkdownContent } from "@/components/markdown";
import { ProjectImg } from "@/components/project-media";
import { PublicShell } from "@/components/public-shell";
import { Button, Card } from "@/components/ui";
import { getArticleBySlug, getArticles } from "@/lib/data";
import { alternatesFor, asLocale, fmt, getDictionary } from "@/i18n";

export const revalidate = 3600;

type Params = Promise<{ locale: string; slug: string }>;

export async function generateStaticParams() {
  const all = await getArticles("en").catch(() => []);
  return all.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = asLocale(raw);
  const a = await getArticleBySlug(slug, locale);
  if (!a) return { title: getDictionary(locale).blog.notFound };
  return {
    title: a.title,
    description: a.excerpt,
    alternates: alternatesFor(locale, `/blog/${slug}`),
    openGraph: { type: "article", title: a.title, description: a.excerpt, publishedTime: a.publishedAt, tags: a.tags, images: a.coverUrl ? [a.coverUrl] : undefined },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { locale: raw, slug } = await params;
  const locale = asLocale(raw);
  const t = getDictionary(locale);
  const [article, all] = await Promise.all([getArticleBySlug(slug, locale), getArticles(locale)]);
  if (!article) notFound();

  // newest first: index - 1 is the NEWER article, index + 1 the OLDER one
  const i = all.findIndex((a) => a.id === article.id);
  const newer = i > 0 ? all[i - 1] : undefined;
  const older = i < all.length - 1 ? all[i + 1] : undefined;
  // "keep reading": articles sharing a tag first, then the newest of the rest
  const others = all.filter((a) => a.id !== article.id);
  const shared = (a: (typeof all)[number]) => a.tags.filter((x) => article.tags.includes(x)).length;
  const more = [...others].sort((a, b) => shared(b) - shared(a) || +new Date(b.publishedAt) - +new Date(a.publishedAt)).slice(0, 3);

  return (
    <PublicShell locale={locale}>
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6">
        <Button href="/blog" variant="ghost" size="sm" icon="arrow-left" className="-ms-2">
          {t.blog.back}
        </Button>

        <header className="space-y-4">
          {article.tags.length > 0 && (
            <ul aria-label={t.blog.articleTags} className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <li key={tag}>
                  <LocaleLink
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    aria-label={fmt(t.blog.tagLink, { tag })}
                    className="inline-flex rounded-full bg-accent-400/15 px-3 py-1 text-xs font-semibold text-accent-300 ring-1 ring-accent-400/40 transition hover:bg-accent-400/25"
                  >
                    {tag}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          )}
          <h1 dir="auto" className="font-display text-3xl leading-tight text-fg sm:text-5xl">
            {article.title}
          </h1>
          <ArticleMeta a={article} className="text-sm" />
          {article.excerpt && (
            <p dir="auto" className="text-lg leading-relaxed text-muted">
              {article.excerpt}
            </p>
          )}
        </header>

        {article.coverUrl && (
          <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
            <ProjectImg image={{ url: article.coverUrl, alt: article.coverAlt }} sizes="(min-width: 768px) 768px, 100vw" className="aspect-video w-full object-cover" />
          </figure>
        )}

        <Card className="p-6 sm:p-10">
          <MarkdownContent source={article.content} variant="article" newTabLabel={t.common.opensInNewTab} />
        </Card>

        {(newer || older) && (
          <nav aria-label={t.blog.keepReading} className="grid gap-4 sm:grid-cols-2">
            {newer ? (
              <LocaleLink href={`/blog/${newer.slug}`} className="group rounded-2xl border border-line bg-surface/80 p-5 transition hover:border-accent-400/60">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                  <Icon name="arrow-left" className="h-3.5 w-3.5" /> {t.blog.newer}
                </span>
                <span dir="auto" className="mt-1.5 block font-display text-base text-fg transition group-hover:text-accent-300">
                  {newer.title}
                </span>
              </LocaleLink>
            ) : (
              <span />
            )}
            {older && (
              <LocaleLink href={`/blog/${older.slug}`} className="group rounded-2xl border border-line bg-surface/80 p-5 text-end transition hover:border-accent-400/60">
                <span className="flex items-center justify-end gap-1.5 text-xs font-semibold text-muted">
                  {t.blog.older} <Icon name="arrow-right" className="h-3.5 w-3.5" />
                </span>
                <span dir="auto" className="mt-1.5 block font-display text-base text-fg transition group-hover:text-accent-300">
                  {older.title}
                </span>
              </LocaleLink>
            )}
          </nav>
        )}
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more" className="border-t border-line bg-canvas-deep/40 py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="more" className="font-display text-3xl text-fg">
                  {t.blog.keepReading}
                </h2>
                <p className="mt-1 text-sm text-muted">{t.blog.keepReadingSub}</p>
              </div>
              <Button href="/blog" variant="soft" icon="file-text">
                {t.blog.viewAll}
              </Button>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((a) => (
                <li key={a.id} className="flex">
                  <div className="h-full w-full">
                    <ArticleCard a={a} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </PublicShell>
  );
}
