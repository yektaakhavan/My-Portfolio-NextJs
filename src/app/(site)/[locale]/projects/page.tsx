import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ProjectsExplorer } from "@/components/projects-explorer";
import { PublicShell } from "@/components/public-shell";
import { getProjects } from "@/lib/data";
import { alternatesFor, asLocale, getDictionary } from "@/i18n";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = getDictionary((await params).locale);
  return { title: t.projects.metaTitle, description: t.projects.metaDesc, alternates: alternatesFor(asLocale((await params).locale), "/projects") };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale);
  const projects = await getProjects(locale);
  return (
    <PublicShell locale={locale}>
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">
        <PageHeader eyebrow={t.projects.eyebrow} title={t.projects.title}>
          {t.projects.sub}
        </PageHeader>
        <ProjectsExplorer projects={projects} />
      </div>
    </PublicShell>
  );
}
