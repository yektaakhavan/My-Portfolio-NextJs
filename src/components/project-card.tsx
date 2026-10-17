import Link from "next/link";
import { cn } from "@/lib/utils";
import { monogram, type Project } from "@/lib/types";
import { Icon } from "./icons";
import { ProjectImg, ScreenshotsButton } from "./project-media";
import { Badge, Button, Card } from "./ui";

/** Used on the home page and on /projects. Heading level is configurable to keep a correct h1 → h2 → h3 outline. */
export function ProjectCard({ p, as: Heading = "h3" }: { p: Project; as?: "h2" | "h3" }) {
  const cover = p.images[0];
  return (
    <Card className="group flex flex-col justify-between overflow-hidden transition hover:border-accent-400/60 hover:shadow-2xl">
      <div>
        <div className={cn("relative flex h-44 items-center justify-center overflow-hidden", !cover && `project-accent-${p.accent % 5}`)}>
          {cover ? (
            <ProjectImg image={cover} sizes="(min-width: 768px) 50vw, 100vw" className="h-full w-full object-cover" />
          ) : (
            <span aria-hidden className="font-display text-5xl text-white/25">
              {monogram(p.title)}
            </span>
          )}
          {p.featured && (
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
              <Icon name="star" className="h-3 w-3 text-accent-300" /> Featured
            </span>
          )}
          {p.tags.length > 0 && (
            <ul aria-label="Tags" className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 pr-3">
              {p.tags.map((t) => (
                <li key={t} className="rounded-full bg-black/70 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-6">
          <Heading className="font-display text-xl text-fg">
            <Link href={`/projects/${p.slug}`} className="transition hover:text-accent-300">
              {p.title}
            </Link>
          </Heading>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{p.description}</p>
          <ul aria-label="Technologies" className="mt-4 flex flex-wrap gap-1.5">
            {p.tech.map((t) => (
              <li key={t}>
                <Badge tone="neutral">{t}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line px-6 pt-4 pb-6">
        <Button href={`/projects/${p.slug}`} size="sm" icon="eye">
          View details<span className="sr-only"> of {p.title}</span>
        </Button>
        {p.liveUrl && (
          <Button href={p.liveUrl} external size="sm" variant="outline" icon="external">
            Live demo<span className="sr-only"> of {p.title}</span>
          </Button>
        )}
        {p.githubUrl && (
          <Button href={p.githubUrl} external size="sm" variant="soft" icon="github">
            Source code<span className="sr-only"> of {p.title}</span>
          </Button>
        )}
        <ScreenshotsButton title={p.title} images={p.images} />
      </div>
    </Card>
  );
}
