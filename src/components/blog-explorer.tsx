"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import type { Article } from "@/lib/types";
import { fmt, formatNumber } from "@/i18n";
import { useI18n } from "@/i18n/provider";
import { ArticleCard } from "./article-card";
import { Button, Card, EmptyState, Input } from "./ui";

const ALL = ""; // language-neutral "All" marker

// /blog?tag=Next.js — read from the address bar WITHOUT making the page dynamic:
// the server renders the full unfiltered list (good for search engines), the browser then applies the tag.
const noop = () => () => {};
const readSearch = () => window.location.search;
const serverSearch = () => "";

export function BlogExplorer({ articles }: { articles: Article[] }) {
  const { t, locale } = useI18n();
  const allTags = useMemo(() => [ALL, ...Array.from(new Set(articles.flatMap((a) => a.tags)))], [articles]);
  const urlTag = new URLSearchParams(useSyncExternalStore(noop, readSearch, serverSearch)).get("tag") ?? ALL;
  const [picked, setPicked] = useState<string | null>(null); // null = the visitor has not clicked a tag yet
  const tag = picked ?? (allTags.includes(urlTag) ? urlTag : ALL);
  const setTag = (x: string) => setPicked(x);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return articles.filter(
      (a) =>
        (tag === ALL || a.tags.includes(tag)) &&
        (!q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.tags.some((x) => x.toLowerCase().includes(q))),
    );
  }, [articles, tag, search]);

  const reset = () => {
    setPicked(ALL);
    setSearch("");
  };

  return (
    <div className="space-y-8">
      <Card className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:w-80">
            <label htmlFor="blog-search" className="mb-1.5 block text-xs font-semibold text-muted">
              {t.blog.search}
            </label>
            <Input id="blog-search" type="search" dir="auto" placeholder={t.blog.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div role="group" aria-label={t.blog.filterTag} className="flex flex-wrap gap-1.5">
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
        <p className="border-t border-line pt-3 text-xs font-medium text-muted" role="status" aria-live="polite">
          {fmt(t.blog.showing, { a: formatNumber(locale, filtered.length), b: formatNumber(locale, articles.length) })}
        </p>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon="file-text"
          title={t.blog.emptyTitle}
          description={t.blog.emptyText}
          action={
            <Button variant="outline" size="sm" onClick={reset}>
              {t.blog.clear}
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <li key={a.id} className="flex">
              <div className="h-full w-full">
                <ArticleCard a={a} as="h2" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

