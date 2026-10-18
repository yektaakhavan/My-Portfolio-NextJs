import type { Metadata } from "next";
import { PublicForm } from "@/components/forms";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { PublicShell } from "@/components/public-shell";
import { Card, EmptyState } from "@/components/ui";
import { getApprovedMessages } from "@/lib/data";
import { alternatesFor, asLocale, fmt, formatDate, formatNumber, getDictionary } from "@/i18n";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = getDictionary((await params).locale);
  return { title: t.messages.metaTitle, description: t.messages.metaDesc, alternates: alternatesFor(asLocale((await params).locale), "/messages") };
}

export default async function MessagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale);
  const items = await getApprovedMessages(50);
  return (
    <PublicShell locale={locale}>
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6">
        <PageHeader eyebrow={t.messages.eyebrow} title={t.messages.title}>
          {t.messages.sub}
        </PageHeader>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section aria-labelledby="wall" className="space-y-4">
            <h2 id="wall" className="font-display text-xl text-fg">{fmt(t.messages.approved, { n: formatNumber(locale, items.length) })}</h2>
            {items.length === 0 ? (
              <EmptyState as="h3" icon="message" title={t.messages.emptyTitle} description={t.messages.emptyText} />
            ) : (
              <ul className="space-y-4">
                {items.map((m) => (
                  <li key={m.id}>
                    <Card className="p-5">
                      <figure>
                        <blockquote dir="auto" className="whitespace-pre-line text-sm leading-relaxed text-fg/90">{m.body}</blockquote>
                        <figcaption className="mt-3 flex items-center justify-between gap-3 text-xs text-muted">
                          <span dir="auto" className="inline-flex items-center gap-2 font-semibold text-accent-300">
                            <Icon name="user" className="h-3.5 w-3.5" />{m.name}
                          </span>
                          <time dateTime={m.createdAt}>{formatDate(locale, m.createdAt)}</time>
                        </figcaption>
                      </figure>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <Card className="h-fit p-6 shadow-2xl sm:p-8">
            <h2 className="mb-4 font-display text-xl text-fg">{t.messages.formTitle}</h2>
            <PublicForm variant="public" />
          </Card>
        </div>
      </div>
    </PublicShell>
  );
}
