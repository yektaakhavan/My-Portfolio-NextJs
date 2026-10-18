import type { Metadata } from "next";
import { PublicForm } from "@/components/forms";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { PublicShell } from "@/components/public-shell";
import { Card } from "@/components/ui";
import { getProfile } from "@/lib/data";
import { alternatesFor, asLocale, getDictionary } from "@/i18n";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = getDictionary((await params).locale);
  return { title: t.contact.metaTitle, description: t.contact.metaDesc, alternates: alternatesFor(asLocale((await params).locale), "/contact") };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale);
  const profile = await getProfile(locale);
  return (
    <PublicShell locale={locale}>
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6">
        <PageHeader eyebrow={t.contact.eyebrow} title={t.contact.title}>
          {t.contact.sub}
        </PageHeader>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <h2 className="font-display text-xl text-fg">{t.contact.info}</h2>
            {profile && (
              <>
                <Card className="space-y-4 p-5">
                  {profile.email && (
                    <div className="flex items-start gap-3">
                      <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-400/15 text-accent-300 ring-1 ring-accent-400/40"><Icon name="mail" className="h-5 w-5" /></span>
                      <div>
                        <p className="text-xs font-semibold text-muted">{t.contact.email}</p>
                        <a href={`mailto:${profile.email}`} dir="ltr" className="text-sm font-semibold text-fg underline-offset-2 hover:text-accent-300 hover:underline">{profile.email}</a>
                      </div>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-start gap-3">
                      <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-400/15 text-brand-300 ring-1 ring-brand-400/40"><Icon name="phone" className="h-5 w-5" /></span>
                      <div>
                        <p className="text-xs font-semibold text-muted">{t.contact.phone}</p>
                        <p dir="ltr" className="text-sm font-semibold text-fg">{profile.phone}</p>
                      </div>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-start gap-3">
                      <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-400/15 text-accent-300 ring-1 ring-accent-400/40"><Icon name="map-pin" className="h-5 w-5" /></span>
                      <div>
                        <p className="text-xs font-semibold text-muted">{t.contact.location}</p>
                        <p className="text-sm font-semibold text-fg">{profile.location}</p>
                      </div>
                    </div>
                  )}
                </Card>
                <Card className="space-y-2 p-5">
                  <p className="flex items-center gap-2 text-xs font-bold text-ok"><Icon name="shield" className="h-4 w-4" /> {t.contact.privateTitle}</p>
                  <p className="text-xs leading-relaxed text-muted">{t.contact.privateText}</p>
                </Card>
              </>
            )}
          </div>
          <Card className="p-6 shadow-2xl sm:p-8">
            <h2 className="mb-4 font-display text-xl text-fg">{t.contact.formTitle}</h2>
            <PublicForm variant="contact" />
          </Card>
        </div>
      </div>
    </PublicShell>
  );
}
