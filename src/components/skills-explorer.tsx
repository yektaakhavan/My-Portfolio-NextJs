"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { levelTone, type Skill } from "@/lib/types";
import { fmt, formatNumber } from "@/i18n";
import { useI18n } from "@/i18n/provider";
import { SkillMark } from "./icons";
import { Badge, Button, Card, EmptyState, Input } from "./ui";

const CATEGORIES = ["all", "frontend", "tools", "soft"] as const;
const LEVELS = ["all", "Advanced", "Intermediate", "Beginner"] as const;

export function SkillsExplorer({ skills }: { skills: Skill[] }) {
  const { t, locale } = useI18n();
  const [category, setCategory] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return skills.filter((s) => {
      const matchCat = category === "all" || s.category === category;
      const matchLevel = level === "all" || s.level === level;
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
      return matchCat && matchLevel && matchSearch;
    });
  }, [skills, category, level, search]);

  const reset = () => {
    setCategory("all");
    setLevel("all");
    setSearch("");
  };
  const catLabel = (c: string) => (c === "all" ? t.common.all : (t.categories[c] ?? c));
  const levelLabel = (l: string) => (l === "all" ? t.common.all : (t.levels[l] ?? l));

  return (
    <div className="space-y-8">
      <Card className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:w-72">
            <label htmlFor="skill-search" className="mb-1.5 block text-xs font-semibold text-muted">
              {t.skills.search}
            </label>
            <Input id="skill-search" type="search" dir="auto" placeholder={t.skills.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div role="group" aria-label={t.skills.filterCategory} className="flex flex-wrap gap-1.5">
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
                {catLabel(c)}
              </button>
            ))}
          </div>
        </div>
        <div role="group" aria-label={t.skills.filterLevel} className="flex flex-wrap items-center gap-2 border-t border-line pt-3 text-xs">
          <span className="font-semibold text-muted" aria-hidden>
            {t.skills.proficiency}
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
              {levelLabel(lvl)}
            </button>
          ))}
        </div>
      </Card>

      <p className="text-sm text-muted" role="status" aria-live="polite">
        {fmt(t.skills.showing, { a: formatNumber(locale, filtered.length), b: formatNumber(locale, skills.length) })}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon="code"
          title={t.skills.emptyTitle}
          description={t.skills.emptyText}
          action={
            <Button variant="outline" size="sm" onClick={reset}>
              {t.skills.reset}
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
                <h2 dir="auto" className="font-display text-base text-fg">
                  {s.name}
                </h2>
                <p className="mt-0.5 text-xs text-muted">{catLabel(s.category)}</p>
                <Badge tone={levelTone(s.level)} className="mt-3">
                  <span className="sr-only">{t.common.level} </span>
                  {levelLabel(s.level)}
                </Badge>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
