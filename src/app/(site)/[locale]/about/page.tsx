import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { PublicShell } from "@/components/public-shell";
import { Badge, Button, Card } from "@/components/ui";
import { getProfile } from "@/lib/data";
import { alternatesFor, asLocale, fmt, getDictionary } from "@/i18n";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = getDictionary((await params).locale);
  return { title: t.about.metaTitle, description: t.about.metaDesc, alternates: alternatesFor(asLocale((await params).locale), "/about") };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale);
  const profile = await getProfile(locale);
  if (!profile) return <PublicShell locale={locale}><p className="px-4 py-24 text-center text-muted">{t.about.notSetUp}</p></PublicShell>;
  const hasAvatar = !!profile.avatarUrl && profile.avatarUrl !== "/images/avatar.jpg";

  return (
    <PublicShell locale={locale}>
      <div className="mx-auto max-w-4xl space-y-16 px-4 py-12 sm:px-6">
        <PageHeader eyebrow={t.about.eyebrow} title={fmt(t.about.title, { name: profile.name })}>
          <p className="text-lg font-medium text-brand-300">{profile.title}</p>
        </PageHeader>

        <Card className="p-6 sm:p-10">
          <div className="grid items-center gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                {hasAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt={profile.avatarAlt || fmt(t.common.portraitOf, { name: profile.name })} width={224} height={256} decoding="async" className="h-64 w-56 rounded-2xl border border-accent-400/50 object-cover shadow-2xl" />
                ) : (
                  <div aria-hidden className="flex h-64 w-56 items-center justify-center rounded-2xl border border-accent-400/50 bg-surface-2 font-display text-6xl text-accent-300">
                    {profile.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}
                  </div>
                )}
              </div>
              <p className="text-sm font-semibold text-accent-300">{profile.name}</p>
              <p className="mt-0.5 text-xs text-muted">{profile.location}</p>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-muted sm:text-base">
              {profile.bio.map((p, i) => <p key={i} dir="auto">{p}</p>)}
              <ul aria-label={t.about.strengths} className="flex flex-wrap gap-2 border-t border-line pt-4">
                {profile.traits.map((trait) => (
                  <li key={trait} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2/80 px-3.5 py-1.5 text-xs font-semibold text-fg">
                    <Icon name="spark" className="h-3.5 w-3.5 text-accent-300" />{trait}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {profile.experience.length > 0 && (
          <section aria-labelledby="exp-title" className="space-y-6">
            <div className="flex items-center gap-3">
              <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-400/15 text-accent-300 ring-1 ring-accent-400/40"><Icon name="folder" className="h-5 w-5" /></span>
              <div>
                <h2 id="exp-title" className="font-display text-2xl text-fg">{t.about.experience}</h2>
                <p className="text-xs text-muted">{t.about.experienceSub}</p>
              </div>
            </div>
            <ul className="space-y-4">
              {profile.experience.map((exp, i) => (
                <li key={i}>
                  <Card className="p-6">
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
                      <div>
                        <h3 className="font-display text-lg text-accent-300">{exp.role}</h3>
                        <p className="text-sm font-medium text-brand-300">{exp.company}</p>
                      </div>
                      <Badge tone="gold">{exp.period}</Badge>
                    </div>
                    <ul className="space-y-2 text-sm text-muted">
                      {exp.points.map((point, k) => (
                        <li key={k} className="flex items-start gap-2.5">
                          <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                          <span dir="auto">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        )}

        {profile.education.length > 0 && (
          <section aria-labelledby="edu-title" className="space-y-6">
            <div className="flex items-center gap-3">
              <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-400/15 text-brand-300 ring-1 ring-brand-400/40"><Icon name="code" className="h-5 w-5" /></span>
              <div>
                <h2 id="edu-title" className="font-display text-2xl text-fg">{t.about.education}</h2>
                <p className="text-xs text-muted">{t.about.educationSub}</p>
              </div>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {profile.education.map((ed, i) => (
                <li key={i}>
                  <Card className="h-full p-5">
                    <Badge tone="violet" className="mb-2">{ed.period}</Badge>
                    <h3 className="font-display text-base text-fg">{ed.degree}</h3>
                    <p className="mt-1 text-xs font-semibold text-muted">{ed.school}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <div>
            <p className="text-sm font-semibold text-fg">{t.about.skillsQ}</p>
            <p className="text-xs text-muted">{t.about.skillsQSub}</p>
          </div>
          <div className="flex gap-2">
            <Button href="/skills" icon="code">{t.about.viewSkills}</Button>
            <Button href="/resume" variant="outline" icon="eye">{t.about.viewResume}</Button>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
