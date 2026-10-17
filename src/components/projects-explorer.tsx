"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { Icon } from "./icons";
import { ProjectCard } from "./project-card";
import { Button, Card, EmptyState, Input } from "./ui";

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [tag, setTag] = useState("All");
  const [search, setSearch] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const allTags = useMemo(() => ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))], [projects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const matchTag = tag === "All" || p.tags.includes(tag);
      const matchFeatured = !featuredOnly || p.featured;
      const matchSearch =
        !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tech.some((t) => t.toLowerCase().includes(q));
      return matchTag && matchFeatured && matchSearch;
    });
  }, [projects, tag, featuredOnly, search]);

  const reset = () => {
    setTag("All");
    setSearch("");
    setFeaturedOnly(false);
  };

  return (
    <div className="space-y-8">
      <Card className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:w-80">
            <label htmlFor="project-search" className="mb-1.5 block text-xs font-semibold text-muted">
              Search projects
            </label>
            <Input id="project-search" type="search" placeholder="Title, description or technology" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div role="group" aria-label="Filter by tag" className="flex flex-wrap gap-1.5">
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tag === t}
                onClick={() => setTag(t)}
                className={cn(
                  "min-h-9 rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                  tag === t ? "bg-accent-400 text-on-accent shadow-md" : "border border-muted/75 bg-canvas/60 text-muted hover:text-fg",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-3 text-xs">
          <span className="font-medium text-muted" role="status" aria-live="polite">
            Showing {filtered.length} of {projects.length} projects
          </span>
          <button
            type="button"
            aria-pressed={featuredOnly}
            onClick={() => setFeaturedOnly((v) => !v)}
            className={cn(
              "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition",
              featuredOnly ? "bg-accent-400/20 text-accent-300 ring-1 ring-accent-400/50" : "text-muted hover:text-fg",
            )}
          >
            <Icon name="star" className="h-3.5 w-3.5" />
            Featured only
          </button>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon="folder"
          title="No projects match your search"
          description="Try adjusting your tag filters or search query."
          action={
            <Button variant="outline" size="sm" onClick={reset}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {filtered.map((p) => (
            <li key={p.id} className="flex">
              <div className="w-full">
                <ProjectCard p={p} as="h2" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
