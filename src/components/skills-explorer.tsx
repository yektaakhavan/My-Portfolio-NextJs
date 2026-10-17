"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, levelTone, type Skill } from "@/lib/types";
import { SkillMark } from "./icons";
import { Badge, Button, Card, EmptyState, Input } from "./ui";

const CATEGORIES = ["All", "Frontend", "Tools", "Soft"];
const LEVELS = ["All", "Advanced", "Intermediate", "Beginner"];

export function SkillsExplorer({ skills }: { skills: Skill[] }) {
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return skills.filter((s) => {
      const matchCat = category === "All" || s.category === category.toLowerCase() || CATEGORY_LABELS[s.category] === category;
      const matchLevel = level === "All" || s.level === level;
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
      return matchCat && matchLevel && matchSearch;
    });
  }, [skills, category, level, search]);

  const reset = () => {
    setCategory("All");
    setLevel("All");
    setSearch("");
  };

  return (
    <div className="space-y-8">
      <Card className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:w-72">
            <label htmlFor="skill-search" className="mb-1.5 block text-xs font-semibold text-muted">
              Search skills
            </label>
            <Input id="skill-search" type="search" placeholder="e.g. React, Git, SASS" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={cn(
                  "min-h-9 rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                  category === c ? "bg-accent-400 text-on-accent shadow-md" : "border border-muted/75 bg-canvas/60 text-muted hover:text-fg",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div role="group" aria-label="Filter by proficiency" className="flex flex-wrap items-center gap-2 border-t border-line pt-3 text-xs">
          <span className="font-semibold text-muted" aria-hidden>
            Proficiency:
          </span>
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              type="button"
              aria-pressed={level === lvl}
              onClick={() => setLevel(lvl)}
              className={cn(
                "min-h-8 rounded-md px-2.5 py-1 transition",
                level === lvl ? "bg-brand-400/20 font-semibold text-brand-300 ring-1 ring-brand-400/50" : "text-muted hover:text-fg",
              )}
            >
              {lvl}
            </button>
          ))}
        </div>
      </Card>

      <p className="text-sm text-muted" role="status" aria-live="polite">
        Showing {filtered.length} of {skills.length} skills
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon="code"
          title="No skills found"
          description="Try clearing your search or filters to see all skills."
          action={
            <Button variant="outline" size="sm" onClick={reset}>
              Reset filters
            </Button>
          }
        />
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((s) => (
            <li key={s.id}>
              <Card className="flex h-full flex-col items-center p-5 text-center transition hover:-translate-y-1 hover:border-accent-400/60 hover:shadow-xl">
                <span aria-hidden className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-accent-300 ring-1 ring-line">
                  <SkillMark icon={s.icon} className="h-7 w-7" />
                </span>
                <h2 className="font-display text-base text-fg">{s.name}</h2>
                <p className="mt-0.5 text-xs text-muted">{CATEGORY_LABELS[s.category] ?? s.category}</p>
                <Badge tone={levelTone(s.level)} className="mt-3">
                  <span className="sr-only">Level: </span>
                  {s.level}
                </Badge>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
