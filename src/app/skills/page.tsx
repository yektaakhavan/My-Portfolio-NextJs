import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PublicShell } from "@/components/public-shell";
import { SkillsExplorer } from "@/components/skills-explorer";
import { Button } from "@/components/ui";
import { getSkills } from "@/lib/data";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Skills", description: "Frontend engineering, tooling and soft skills." };

export default async function SkillsPage() {
  const skills = await getSkills();
  return (
    <PublicShell>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6">
        <PageHeader eyebrow="Tech stack & tools" title="Skills & competencies">
          Proficiency across frontend engineering, development tooling, design tools and collaboration.
        </PageHeader>
        <SkillsExplorer skills={skills} />
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <div>
            <p className="text-sm font-semibold text-fg">Want to see these skills in real projects?</p>
            <p className="text-xs text-muted">Browse my portfolio of web applications and interfaces.</p>
          </div>
          <Button href="/projects" icon="folder">View projects</Button>
        </div>
      </div>
    </PublicShell>
  );
}
