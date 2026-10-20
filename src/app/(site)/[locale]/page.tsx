import { Icon, SkillMark } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { PublicShell } from "@/components/public-shell";
import { Badge, Button, Card } from "@/components/ui";
import { ArticleSlider } from "@/components/article-slider";
import { getArticles, getProfile, getProjects, getSkills } from "@/lib/data";
import { levelTone } from "@/lib/types";
import type { Metadata } from "next";
import { alternatesFor, asLocale, fmt, formatNumber, getDictionary } from "@/i18n";

export const revalidate = 3600; // cached; admin changes call revalidatePath so they appear instantly

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { alternates: alternatesFor(asLocale((await params).locale), "/") };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale);
  const [profile, projects, skills, articles] = await Promise.all([getProfile(locale), getProjects(locale), getSkills(locale), getArticles(locale)]);
  const latest = articles.slice(0, 4);
  const featured = projects.filter((p) => p.featured).concat(projects.filter((p) => !p.featured)).slice(0, 4);
  const topSkills = skills.slice(0, 8);
  const name = profile?.name ?? "Your Name";
  const hasAvatar = !!profile?.avatarUrl && profile.avatarUrl !== "/images/avatar.jpg";
  const n = (x: number) => formatNumber(locale, x);

  return (
    <PublicShell locale={locale}>
      <section aria-labelledby="hero-title" className="relative overflow-hidden py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 text-center lg:text-start">
            <p className="inline-flex items-center gap-2 rounded-full border border-ok/50 bg-ok/10 px-3.5 py-1 text-xs font-semibold text-ok">
              <span aria-hidden className="h-2 w-2 rounded-full bg-ok" />
              {t.home.available}
            </p>
            <h1 id="hero-title" className="font-display text-4xl leading-tight text-accent-300 sm:text-6xl">
              {name}
            </h1>
            <p className="text-xl font-semibold text-brand-300">{profile?.title ?? t.nav.role}</p>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted lg:mx-0">{profile?.tagline}</p>
            <div className="flex flex-wrap justify-center gap-3 pt-2 lg:justify-start">
              <Button href="/projects" size="lg" icon="folder">{t.home.explore}</Button>
              <Button href="/about" size="lg" variant="outline" icon="user">{t.home.aboutMe}</Button>
              <Button href="/contact" size="lg" variant="soft" icon="send">{t.home.getInTouch}</Button>
            </div>
            {profile?.location && (
              <p className="flex items-center justify-center gap-2 text-xs font-medium text-muted lg:justify-start">
                <Icon name="map-pin" className="h-4 w-4 text-accent-300" />
                {fmt(t.home.basedIn, { place: profile.location })}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div aria-hidden className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-brand-500/30 via-accent-400/20 to-transparent blur-2xl" />
              {hasAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile!.avatarUrl}
                  alt={profile!.avatarAlt || fmt(t.common.portraitOf, { name })}
                  width={320}
                  height={384}
                  fetchPriority="high"
                  decoding="async"
                  className="relative h-80 w-72 rounded-[2rem] border border-accent-400/50 object-cover shadow-2xl sm:h-96 sm:w-80"
                />
              ) : (
                <div aria-hidden className="relative flex h-80 w-72 items-center justify-center rounded-[2rem] border border-accent-400/50 bg-surface-2 font-display text-7xl text-accent-300 sm:h-96 sm:w-80">
                  {name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}
                </div>
              )}
              <div className="absolute -bottom-4 -end-4 rounded-2xl border border-line bg-surface px-4 py-3 shadow-2xl">
                <p className="text-xs font-semibold text-muted uppercase">{t.home.specialization}</p>
                <p className="text-sm font-bold text-accent-300">{t.home.specializationValue}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {profile && profile.bio.length > 0 && (
        <section aria-labelledby="intro-title" className="border-t border-line py-16">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold tracking-widest text-accent-300 uppercase">{t.home.introEyebrow}</p>
              <h2 id="intro-title" className="mt-2 font-display text-3xl text-fg sm:text-4xl">
                {t.home.introTitle}
              </h2>
              {profile.bio.slice(0, 2).map((p, i) => (
                <p key={i} dir="auto" className="mt-4 leading-relaxed text-muted">{p}</p>
              ))}
              <div className="mt-6">
                <Button href="/about" variant="outline" icon="arrow-right">{t.home.readStory}</Button>
              </div>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {profile.traits.map((trait, idx) => (
                <li key={trait}>
                  <Card className="flex items-center gap-3 p-4">
                    <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-400/15 text-accent-300 ring-1 ring-accent-400/40">
                      <Icon name={idx === 0 ? "spark" : idx === 1 ? "code" : "user"} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-fg">{trait}</p>
                      <p className="text-xs text-muted">{t.home.coreStrength}</p>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="featured-title" className="border-t border-line bg-canvas-deep/40 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <p className="text-xs font-bold tracking-widest text-accent-300 uppercase">{t.home.highlights}</p>
              <h2 id="featured-title" className="mt-1 font-display text-3xl text-fg">{t.home.featured}</h2>
            </div>
            <Button href="/projects" variant="soft" icon="folder">{fmt(t.home.viewAllProjects, { n: n(projects.length) })}</Button>
          </div>
          <ul className="grid gap-6 md:grid-cols-2">
            {featured.map((p) => (
              <li key={p.id} className="flex"><div className="h-full w-full"><ProjectCard p={p} maxTech={4} /></div></li>
            ))}
          </ul>
        </div>
      </section>

      {topSkills.length > 0 && (
        <section aria-labelledby="skills-title" className="border-t border-line py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold tracking-widest text-accent-300 uppercase">{t.home.stack}</p>
              <h2 id="skills-title" className="mt-1 font-display text-3xl text-fg">{t.home.skillsTitle}</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">{t.home.skillsSub}</p>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {topSkills.map((s) => (
                <li key={s.id} className="flex flex-col items-center rounded-2xl border border-line bg-surface/60 p-4 text-center transition hover:-translate-y-1 hover:border-accent-400/60">
                  <span aria-hidden className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-accent-300 ring-1 ring-line">
                    <SkillMark icon={s.icon} className="h-6 w-6" />
                  </span>
                  <p dir="auto" className="text-sm font-semibold text-fg">{s.name}</p>
                  <Badge tone={levelTone(s.level)} className="mt-2"><span className="sr-only">{t.common.level} </span>{t.levels[s.level] ?? s.level}</Badge>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-center">
              <Button href="/skills" variant="outline" icon="arrow-right">{fmt(t.home.viewAllSkills, { n: n(skills.length) })}</Button>
            </div>
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section aria-labelledby="blog-title" className="border-t border-line bg-canvas-deep/40 py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-widest text-accent-300 uppercase">{t.blog.sliderEyebrow}</p>
                <h2 id="blog-title" className="mt-1 font-display text-2xl text-fg">{t.blog.sliderTitle}</h2>
              </div>
              <Button href="/blog" variant="ghost" size="sm" icon="arrow-right">{articles.length > 4 ? fmt(t.blog.viewAllN, { n: n(articles.length) }) : t.blog.viewAll}</Button>
            </div>
            <ArticleSlider articles={latest} label={t.blog.sliderLabel} />
          </div>
        </section>
      )}

      <section aria-labelledby="cta-title" className="border-t border-line py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface/80 p-8 shadow-2xl sm:p-12">
            <p className="text-xs font-bold tracking-widest text-accent-300 uppercase">{t.home.ctaEyebrow}</p>
            <h2 id="cta-title" className="mt-2 font-display text-3xl text-fg sm:text-4xl">{t.home.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">{t.home.ctaText}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="/contact" size="lg" icon="send">{t.home.ctaPrivate}</Button>
              <Button href="/messages" size="lg" variant="outline" icon="message">{t.home.ctaPublic}</Button>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
