import type { Metadata } from "next";
import { BlogExplorer } from "@/components/blog-explorer";
import { PageHeader } from "@/components/page-header";
import { PublicShell } from "@/components/public-shell";
import { EmptyState } from "@/components/ui";
import { getArticles } from "@/lib/data";
import { alternatesFor, asLocale, getDictionary } from "@/i18n";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale);
  return { title: t.blog.metaTitle, description: t.blog.metaDesc, alternates: alternatesFor(locale, "/blog") };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale);
  const articles = await getArticles(locale);
  return (
    <PublicShell locale={locale}>
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">
        <PageHeader eyebrow={t.blog.eyebrow} title={t.blog.title}>
          {t.blog.sub}
        </PageHeader>
        {articles.length === 0 ? (
          <EmptyState icon="file-text" title={t.blog.noneTitle} description={t.blog.noneText} />
        ) : (
          <BlogExplorer articles={articles} />
        )}
      </div>
    </PublicShell>
  );
}
