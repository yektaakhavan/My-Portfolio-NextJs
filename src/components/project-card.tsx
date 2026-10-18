"use client";

import { cn } from "@/lib/utils";
import { monogram, type Project } from "@/lib/types";
import { fmt } from "@/i18n";
import { useI18n } from "@/i18n/provider";
import { Icon } from "./icons";
import { LocaleLink } from "./locale-link";
import { ProjectImg, ScreenshotsButton } from "./project-media";
import { Badge, Button, Card } from "./ui";

/** Max tag badges drawn on top of the cover image. */
const MAX_COVER_TAGS = 3;

/**
 * Project card with a FIXED height: every region (cover, title, description, badge area, buttons)
 * has a set size, so all cards line up no matter how much text a project has.
 *
 * - The whole card is clickable (stretched link on the title) and opens /projects/[slug].
 * - `maxTech`: how many technology badges to show (the home page passes 4; the full list shows all).
 * - Heading level is configurable to keep a correct h1 → h2 → h3 outline.
 */
export function ProjectCard({
  p,
  as: Heading = "h3",
  maxTech,
}: {
  p: Project;
  as?: "h2" | "h3";
  maxTech?: number;
}) {
  const { t } = useI18n();
  const cover = p.images[0];
  const tags = p.tags.slice(0, MAX_COVER_TAGS);
  const tech = typeof maxTech === "number" ? p.tech.slice(0, maxTech) : p.tech;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden transition hover:border-accent-400/60 hover:shadow-2xl has-[.card-link:focus-visible]:ring-[3px] has-[.card-link:focus-visible]:ring-accent-300">
      {/* Cover — taller than before so screenshots are actually readable */}
      <div className={cn("relative h-56 shrink-0 overflow-hidden sm:h-60", !cover && `project-accent-${p.accent % 5}`)}>
        {cover ? (
          <ProjectImg
            image={cover}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span aria-hidden className="flex h-full items-center justify-center font-display text-6xl text-white/25">
            {monogram(p.title)}
          </span>
        )}
        {p.featured && (
          <span className="absolute top-3 end-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            <Icon name="star" className="h-3 w-3 text-accent-400" /> {t.projects.featured}
          </span>
        )}
        {tags.length > 0 && (
          <ul aria-label={t.projects.tags} className="absolute bottom-3 start-3 flex flex-wrap gap-1.5 pe-3">
            {tags.map((tag) => (
              <li key={tag} className="rounded-full bg-black/70 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Caption — smaller text, fixed-height slots */}
      <div className="flex-1 px-5 pt-4">
        <Heading dir="auto" className="line-clamp-1 h-7 font-display text-lg leading-7 text-fg">
          <LocaleLink
            href={`/projects/${p.slug}`}
            className="card-link transition group-hover:text-accent-300 after:absolute after:inset-0 after:z-[1] after:content-['']"
          >
            {p.title}
          </LocaleLink>
        </Heading>
        <p dir="auto" className="mt-1.5 line-clamp-2 h-10 text-xs leading-5 text-muted">
          {p.description}
        </p>
        <ul aria-label={t.projects.technologies} className="mt-3 flex h-[3.375rem] flex-wrap content-start gap-1.5 overflow-hidden">
          {tech.map((item) => (
            <li key={item}>
              <Badge tone="neutral" className="h-6">
                {item}
              </Badge>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions sit above the stretched link (z-10) and have room for exactly two rows */}
      <div className="relative z-10 flex h-24 flex-wrap content-start gap-2 border-t border-line px-5 pt-3">
        <Button href={`/projects/${p.slug}`} size="sm" icon="eye">
          {t.projects.details}
          <span className="sr-only">{fmt(t.projects.detailsOf, { title: p.title })}</span>
        </Button>
        {p.liveUrl && (
          <Button href={p.liveUrl} external size="sm" variant="outline" icon="external">
            {t.projects.liveDemo}
            <span className="sr-only">{fmt(t.projects.detailsOf, { title: p.title })}</span>
          </Button>
        )}
        {p.githubUrl && (
          <Button href={p.githubUrl} external size="sm" variant="soft" icon="github">
            {t.projects.source}
            <span className="sr-only">{fmt(t.projects.sourceOf, { title: p.title })}</span>
          </Button>
        )}
        <ScreenshotsButton title={p.title} images={p.images} />
      </div>
    </Card>
  );
}
