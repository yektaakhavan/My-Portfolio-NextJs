"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Icon } from "./icons";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

/** Inline script (see layout.tsx) sets data-theme BEFORE first paint, so there is no flash. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})();`;

const subscribe = (cb: () => void) => {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
};
const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
const getServerTheme = (): Theme => "dark";

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  window.dispatchEvent(new Event("themechange"));
}

export function ThemeToggle({ className }: { className?: string }) {
  // The theme lives on <html data-theme>; this reads it without setState-in-effect.
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  useEffect(() => {
    // follow the OS setting until the visitor makes an explicit choice
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem("theme")) return;
      } catch {}
      applyTheme(e.matches ? "light" : "dark");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  const label = theme === "light" ? "Switch to dark theme" : "Switch to light theme";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-muted/75 text-muted transition hover:border-accent-400 hover:text-accent-300",
        className,
      )}
    >
      <Icon name={theme === "light" ? "moon" : "sun"} className="h-4 w-4" />
    </button>
  );
}
