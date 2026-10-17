"use client";

import { useRef } from "react";
import { Icon } from "./icons";
import { useFocusTrap } from "./use-focus-trap";

export type LightboxItem = { url: string; alt: string };

/** Accessible image viewer: dialog semantics, focus trap, Esc to close, ←/→ to navigate, alt text, position announced. */
export function Lightbox({
  items,
  index,
  onClose,
  onNav,
  title,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onNav: (i: number) => void;
  title: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useFocusTrap(true, root, onClose);

  const item = items[index];
  if (!item) return null;
  const prev = () => onNav((index - 1 + items.length) % items.length);
  const next = () => onNav((index + 1) % items.length);

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — image viewer`}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
      className="fixed inset-0 z-[85] flex items-center justify-center bg-canvas-deep/95 p-4 backdrop-blur"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute top-5 right-5 rounded-full border border-muted/75 bg-surface p-3 text-muted transition hover:text-fg"
      >
        <Icon name="x" className="h-5 w-5" />
      </button>
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 rounded-full border border-muted/75 bg-surface p-3 text-muted transition hover:text-fg sm:left-6"
          >
            <Icon name="arrow-right" className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 rounded-full border border-muted/75 bg-surface p-3 text-muted transition hover:text-fg sm:right-6"
          >
            <Icon name="arrow-right" className="h-5 w-5" />
          </button>
        </>
      )}
      <figure className="fade-up max-h-full max-w-4xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.alt}
          className="max-h-[75vh] w-auto rounded-xl border border-line object-contain shadow-2xl"
        />
        <figcaption className="mt-3 text-center text-sm text-muted" aria-live="polite">
          {item.alt}
          <span className="ml-2">
            ({index + 1} of {items.length})
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
