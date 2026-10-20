"use client";

import { cn } from "@/lib/utils";
import { monogram, type Article } from "@/lib/types";
import { fmt, formatDate, formatNumber } from "@/i18n";
import { useI18n } from "@/i18n/provider";
import { Icon } from "./icons";
import { LocaleLink } from "./locale-link";
import { ProjectImg } from "./project-media";
import { Card } from "./ui";

/** Meta line: "12 Oct 2026 · 5 min read" (date is a real <time> element). */
export function ArticleMeta({ a, className }: { a: Article; className?: string }) {
  const { t, locale } = useI18n();
  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted", className)}>
      <span className="sr-only">{t.blog.writtenOn}: </span>
      <time dateTime={a.publishedAt}>{formatDate(locale, a.publishedAt)}</time>
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1">
        <Icon name="clock" className="h-3 w-3" />
        {fmt(t.blog.minRead, { n: formatNumber(locale, a.readingMinutes) })}
      </span>
    </p>
  );
}

/**
 * Article card with a FIXED height (same idea as the project card).
 * `compact` is the small version used in the home-page slider.
 * The whole card is one link (stretched link on the title).
 */
export function ArticleCard({ a, as: Heading = "h3", compact = false }: { a: Article; as?: "h2" | "h3"; compact?: boolean }) {
  const { t } = useI18n();
  const tags = a.tags.slice(0, 3);
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden transition hover:border-accent-400/60 hover:shadow-xl has-[.card-link:focus-visible]:ring-[3px] has-[.card-link:focus-visible]:ring-accent-300">
      <div className={cn("relative shrink-0 overflow-hidden", compact ? "h-28" : "h-44", !a.coverUrl && `project-accent-${a.id % 5}`)}>
        {a.coverUrl ? (
          <ProjectImg
            image={{ url: a.coverUrl, alt: a.coverAlt }}
            sizes={compact ? "260px" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <span aria-hidden className="flex h-full items-center justify-center font-display text-5xl text-white/25">
            {monogram(a.title)}
          </span>
        )}
        {tags.length > 0 && !compact && (
          <ul aria-label={t.blog.articleTags} className="absolute bottom-2.5 start-2.5 flex flex-wrap gap-1.5 pe-2.5">
            {tags.map((tag) => (
              <li key={tag} className="rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "p-3.5" : "p-5")}>
        <Heading
          dir="auto"
          className={cn("font-display text-fg", compact ? "line-clamp-2 h-10 text-sm leading-5" : "line-clamp-2 h-14 text-lg leading-7")}
        >
          <LocaleLink
            href={`/blog/${a.slug}`}
            className="card-link transition group-hover:text-accent-300 after:absolute after:inset-0 after:z-[1] after:content-['']"
          >
            {a.title}
          </LocaleLink>
        </Heading>
        {!compact && (
          <p dir="auto" className="mt-1.5 line-clamp-2 h-10 text-xs leading-5 text-muted">
            {a.excerpt}
          </p>
        )}
        <ArticleMeta a={a} className={compact ? "mt-auto pt-2" : "mt-auto pt-3"} />
      </div>
    </Card>
  );
}
