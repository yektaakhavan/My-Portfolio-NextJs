import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ProjectsExplorer } from "@/components/projects-explorer";
import { PublicShell } from "@/components/public-shell";
import { getProjects } from "@/lib/data";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Projects", description: "Selected web apps, tools and interfaces." };

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">
        <PageHeader eyebrow="Selected work" title="Projects & applications">
          Web apps, tools and interfaces built with modern frameworks and responsive design.
        </PageHeader>
        <ProjectsExplorer projects={projects} />
      </div>
    </PublicShell>
  );
}
