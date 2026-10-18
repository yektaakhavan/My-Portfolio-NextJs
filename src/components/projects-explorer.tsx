"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { fmt, formatNumber } from "@/i18n";
import { useI18n } from "@/i18n/provider";
import { Icon } from "./icons";
import { ProjectCard } from "./project-card";
import { Button, Card, EmptyState, Input } from "./ui";

const ALL = ""; // language-neutral "All" marker

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const { t, locale } = useI18n();
  const [tag, setTag] = useState(ALL);
  const [search, setSearch] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const allTags = useMemo(() => [ALL, ...Array.from(new Set(projects.flatMap((p) => p.tags)))], [projects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const matchTag = tag === ALL || p.tags.includes(tag);
      const matchFeatured = !featuredOnly || p.featured;
      const matchSearch =
        !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tech.some((x) => x.toLowerCase().includes(q));
      return matchTag && matchFeatured && matchSearch;
    });
  }, [projects, tag, featuredOnly, search]);

  const reset = () => {
    setTag(ALL);
    setSearch("");
    setFeaturedOnly(false);
  };

  return (
    <div className="space-y-8">
      <Card className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:w-80">
            <label htmlFor="project-search" className="mb-1.5 block text-xs font-semibold text-muted">
              {t.projects.search}
            </label>
            <Input id="project-search" type="search" dir="auto" placeholder={t.projects.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div role="group" aria-label={t.projects.filterTag} className="flex flex-wrap gap-1.5">
            {allTags.map((x) => (
              <button
                key={x || "all"}
                type="button"
                aria-pressed={tag === x}
                onClick={() => setTag(x)}
                className={cn(
                  "min-h-9 rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                  tag === x ? "bg-accent-400 text-on-accent shadow-md" : "border border-muted/75 bg-canvas/60 text-muted hover:text-fg",
                )}
              >
                {x === ALL ? t.common.all : x}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-3 text-xs">
          <span className="font-medium text-muted" role="status" aria-live="polite">
            {fmt(t.projects.showing, { a: formatNumber(locale, filtered.length), b: formatNumber(locale, projects.length) })}
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
            {t.projects.featuredOnly}
          </button>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon="folder"
          title={t.projects.emptyTitle}
          description={t.projects.emptyText}
          action={
            <Button variant="outline" size="sm" onClick={reset}>
              {t.projects.clear}
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {filtered.map((p) => (
            <li key={p.id} className="flex">
              <div className="h-full w-full">
                <ProjectCard p={p} as="h2" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
