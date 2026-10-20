"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Article } from "@/lib/types";
import { useI18n } from "@/i18n/provider";
import { ArticleCard } from "./article-card";
import { Icon } from "./icons";

/**
 * Small horizontal slider of articles (home page).
 * - plain scroll-snap list: swipe on touch, scroll wheel / arrow buttons on desktop
 * - no autoplay (moving content is an accessibility problem), reduced-motion respected
 * - every card is a normal link, so the keyboard just Tabs through them and the slider follows the focus
 * - works in right-to-left pages too
 */
export function ArticleSlider({ articles, label }: { articles: Article[]; label: string }) {
  const { t, dir } = useI18n();
  const track = useRef<HTMLUListElement>(null);
  const [can, setCan] = useState({ prev: false, next: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft); // negative in right-to-left, so use the absolute value
    setCan({ prev: pos > 4, next: pos < max - 4 });
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, articles.length]);

  function go(forward: boolean) {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = (card?.getBoundingClientRect().width ?? 260) + 16;
    const sign = (forward ? 1 : -1) * (dir === "rtl" ? -1 : 1);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: sign * step, behavior: reduce ? "auto" : "smooth" });
  }

  const btn =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-muted/75 text-muted transition hover:border-accent-400 hover:text-accent-300 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="mb-3 flex justify-end gap-2">
        <button type="button" className={btn} onClick={() => go(false)} disabled={!can.prev} aria-label={t.blog.sliderPrev}>
          <Icon name="arrow-left" className="h-4 w-4" />
        </button>
        <button type="button" className={btn} onClick={() => go(true)} disabled={!can.next} aria-label={t.blog.sliderNext}>
          <Icon name="arrow-right" className="h-4 w-4" />
        </button>
      </div>
      <ul
        ref={track}
        onScroll={measure}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pt-1 pb-3 [scrollbar-width:thin]"
      >
        {articles.map((a) => (
          <li key={a.id} className="w-[15.5rem] shrink-0 snap-start sm:w-64">
            <ArticleCard a={a} compact />
          </li>
        ))}
      </ul>
    </div>
  );
}
