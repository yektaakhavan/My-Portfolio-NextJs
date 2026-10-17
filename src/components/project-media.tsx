"use client";

import { useState } from "react";
import { hasThumb, thumbUrl } from "@/lib/images";
import type { ProjectImage } from "@/lib/types";
import { Icon } from "./icons";
import { Lightbox } from "./lightbox";
import { Button } from "./ui";

/** Lightweight responsive <img>: uploaded files have a 640px and a 1600px version. */
export function ProjectImg({
  image,
  sizes = "(min-width: 640px) 50vw, 100vw",
  className,
}: {
  image: ProjectImage;
  sizes?: string;
  className?: string;
}) {
  const up = hasThumb(image.url);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={up ? thumbUrl(image.url) : image.url}
      srcSet={up ? `${thumbUrl(image.url)} 640w, ${image.url} 1600w` : undefined}
      sizes={up ? sizes : undefined}
      alt={image.alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

/** "View N screenshots of <project>" button + lightbox (used on project cards). */
export function ScreenshotsButton({
  title,
  images,
  variant = "ghost",
}: {
  title: string;
  images: ProjectImage[];
  variant?: "ghost" | "soft";
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  if (!images.length) return null;
  return (
    <>
      <Button
        size="sm"
        variant={variant}
        icon="image"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        aria-haspopup="dialog"
      >
        Screenshots ({images.length})<span className="sr-only"> of {title}</span>
      </Button>
      {open && <Lightbox title={title} items={images} index={index} onClose={() => setOpen(false)} onNav={setIndex} />}
    </>
  );
}

/** Grid of screenshots on the project page; every thumbnail is a real button that opens the lightbox. */
export function ScreenshotGrid({ title, images }: { title: string; images: ProjectImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {images.map((img, idx) => (
          <li key={img.url + idx}>
            <button
              type="button"
              onClick={() => setIndex(idx)}
              aria-haspopup="dialog"
              aria-label={`Enlarge screenshot ${idx + 1} of ${images.length}: ${img.alt}`}
              className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-line bg-canvas"
            >
              <ProjectImg image={img} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 backdrop-blur-xs transition group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-1.5 text-xs font-semibold text-accent-300">
                  <Icon name="eye" className="h-4 w-4" /> Enlarge
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {index !== null && (
        <Lightbox title={title} items={images} index={index} onClose={() => setIndex(null)} onNav={setIndex} />
      )}
    </>
  );
}
