"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./icons";
import { useFocusTrap } from "./use-focus-trap";
import { fmt } from "@/i18n";
import { useI18n } from "@/i18n/provider";

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
  const { t } = useI18n();
  useFocusTrap(true, root, onClose);

  const item = items[index];
  if (!item) return null;
  const prev = () => onNav((index - 1 + items.length) % items.length);
  const next = () => onNav((index + 1) % items.length);

  // Rendered straight under <body>: inside the page, an ancestor with a CSS transform (the page fade-in)
  // turns `position: fixed` into "fixed to that ancestor", and the viewer opened somewhere off-screen.
  return createPortal(
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={fmt(t.lightbox.label, { title })}
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
        aria-label={t.lightbox.close}
        className="absolute top-5 end-5 rounded-full border border-muted/75 bg-surface p-3 text-muted transition hover:text-fg"
      >
        <Icon name="x" className="h-5 w-5" />
      </button>
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label={t.lightbox.prev}
            className="absolute start-3 rounded-full border border-muted/75 bg-surface p-3 text-muted transition hover:text-fg sm:start-6"
          >
            <Icon name="arrow-left" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={t.lightbox.next}
            className="absolute end-3 rounded-full border border-muted/75 bg-surface p-3 text-muted transition hover:text-fg sm:end-6"
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
          <span className="ms-2">{fmt(t.lightbox.position, { i: index + 1, n: items.length })}</span>
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
}
