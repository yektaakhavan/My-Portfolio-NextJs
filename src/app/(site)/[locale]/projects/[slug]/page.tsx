import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { MarkdownContent } from "@/components/markdown";
import { PublicShell } from "@/components/public-shell";
import { ScreenshotGrid } from "@/components/project-media";
import { Badge, Button, Card } from "@/components/ui";
import { getProjectBySlug, getProjects, getRelatedProjects } from "@/lib/data";
import { monogram } from "@/lib/types";
import { cn } from "@/lib/utils";
import { alternatesFor, asLocale, fmt, formatNumber, getDictionary } from "@/i18n";

export const revalidate = 3600;

type Params = Promise<{ locale: string; slug: string }>;

// the parent [locale] segment already generates one set per language; here we add the slugs
export async function generateStaticParams() {
  const all = await getProjects().catch(() => []);
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = asLocale(raw);
  const p = await getProjectBySlug(slug, locale);
  if (!p) return { title: getDictionary(locale).projects.notFound };
  return {
    title: p.title,
    description: p.description.slice(0, 160),
    alternates: alternatesFor(locale, `/projects/${slug}`),
  };
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { locale: raw, slug } = await params;
  const locale = asLocale(raw);
  const t = getDictionary(locale);
  const project = await getProjectBySlug(slug, locale);
  if (!project) notFound();
  const related = await getRelatedProjects(slug, locale);

  return (
    <PublicShell locale={locale}>
      <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6">
        <div className="flex items-center justify-between">
          <Button href="/projects" variant="ghost" size="sm" icon="arrow-left" className="-ms-2">{t.projects.back}</Button>
          {project.featured && <Badge tone="gold"><Icon name="star" className="h-3 w-3" /> {t.projects.featuredProject}</Badge>}
        </div>

        <Card className="overflow-hidden shadow-2xl">
          <div className={cn("relative flex h-52 items-end sm:h-64", `project-accent-${project.accent % 5}`)}>
            <span aria-hidden className="absolute inset-0 flex items-center justify-center font-display text-7xl text-white/25">{monogram(project.title)}</span>
            <div className="relative w-full bg-gradient-to-t from-black/70 to-transparent p-6 sm:p-8">
              {project.tags.length > 0 && (
                <ul aria-label={t.projects.tags} className="mb-2 flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => <li key={tag} className="rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-semibold text-white">{tag}</li>)}
                </ul>
              )}
              <h1 dir="auto" className="font-display text-3xl font-bold text-white sm:text-5xl">{project.title}</h1>
            </div>
          </div>
          <div className="space-y-6 p-6 sm:p-8">
            <section aria-labelledby="overview">
              <h2 id="overview" className="mb-2 text-xs font-bold tracking-widest text-accent-300 uppercase">{t.projects.overview}</h2>
              <p dir="auto" className="text-base leading-relaxed text-fg/90">{project.description}</p>
            </section>
            {project.tags.length > 0 && (
              <section aria-labelledby="tags">
                <h2 id="tags" className="mb-2 text-xs font-bold tracking-widest text-accent-300 uppercase">{t.projects.tags}</h2>
                <ul className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => <li key={tag}><Badge tone="gold" className="px-3 py-1">{tag}</Badge></li>)}
                </ul>
              </section>
            )}
            {project.tech.length > 0 && (
              <section aria-labelledby="tech">
                <h2 id="tech" className="mb-2 text-xs font-bold tracking-widest text-accent-300 uppercase">{t.projects.techUsed}</h2>
                <ul className="flex flex-wrap gap-2">
                  {project.tech.map((x) => <li key={x}><Badge tone="violet" className="px-3 py-1">{x}</Badge></li>)}
                </ul>
              </section>
            )}
            {(project.liveUrl || project.githubUrl) && (
              <div className="flex flex-wrap gap-3 border-t border-line pt-4">
                {project.liveUrl && <Button href={project.liveUrl} external icon="external" size="lg">{t.projects.launch}</Button>}
                {project.githubUrl && <Button href={project.githubUrl} external variant="soft" icon="github" size="lg">{t.projects.viewSource}</Button>}
              </div>
            )}
          </div>
        </Card>

        {project.details.trim() && (
          <section aria-labelledby="notes">
            <Card className="p-6 sm:p-8">
              <h2 id="notes" className="mb-4 font-display text-2xl text-fg">{t.projects.behind}</h2>
              <MarkdownContent source={project.details} newTabLabel={t.common.opensInNewTab} />
            </Card>
          </section>
        )}

        {project.images.length > 0 && (
          <section aria-labelledby="shots" className="space-y-4">
            <div>
              <h2 id="shots" className="font-display text-2xl text-fg">{t.projects.shots}</h2>
              <p className="text-xs text-muted">{fmt(t.projects.shotsCount, { n: formatNumber(locale, project.images.length) })}</p>
            </div>
            <ScreenshotGrid title={project.title} images={project.images} />
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="more" className="space-y-6 border-t border-line pt-8">
            <h2 id="more" className="font-display text-2xl text-fg">{t.projects.others}</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <li key={p.id}>
                  <Card className="h-full p-5 transition hover:border-accent-400/60">
                    <h3 dir="auto" className="font-display text-lg text-fg">{p.title}</h3>
                    <p dir="auto" className="mt-1 line-clamp-2 text-xs text-muted">{p.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <ul className="flex flex-wrap gap-1">{p.tags.slice(0, 2).map((tag) => <li key={tag}><Badge>{tag}</Badge></li>)}</ul>
                      <Button href={`/projects/${p.slug}`} size="sm" variant="ghost" icon="eye">{t.projects.view}<span className="sr-only"> {p.title}</span></Button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </PublicShell>
  );
}
