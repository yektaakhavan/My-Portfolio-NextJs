import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PublicShell } from "@/components/public-shell";
import { SkillsExplorer } from "@/components/skills-explorer";
import { Button } from "@/components/ui";
import { getSkills } from "@/lib/data";
import { alternatesFor, asLocale, getDictionary } from "@/i18n";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = getDictionary((await params).locale);
  return { title: t.skills.metaTitle, description: t.skills.metaDesc, alternates: alternatesFor(asLocale((await params).locale), "/skills") };
}

export default async function SkillsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale);
  const skills = await getSkills(locale);
  return (
    <PublicShell locale={locale}>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6">
        <PageHeader eyebrow={t.skills.eyebrow} title={t.skills.title}>
          {t.skills.sub}
        </PageHeader>
        <SkillsExplorer skills={skills} />
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <div>
            <p className="text-sm font-semibold text-fg">{t.skills.ctaTitle}</p>
            <p className="text-xs text-muted">{t.skills.ctaText}</p>
          </div>
          <Button href="/projects" icon="folder">{t.skills.ctaButton}</Button>
        </div>
      </div>
    </PublicShell>
  );
}
