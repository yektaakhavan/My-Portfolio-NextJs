"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/messages", label: "Messages" },
  { href: "/contact", label: "Contact" },
  { href: "/resume", label: "Resume" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export function PublicHeader({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-200",
        scrolled ? "border-b border-line bg-canvas/92 shadow-lg backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${name} — home`}>
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-surface-3 font-display text-base text-accent-300 ring-1 ring-accent-400/40 transition group-hover:scale-105"
          >
            {initials}
          </span>
          <span className="hidden sm:block">
            <span className="block font-display text-base font-medium text-fg transition group-hover:text-accent-300">{name}</span>
            <span className="block text-[11px] font-semibold tracking-wider text-muted uppercase">Frontend Developer</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-semibold transition-all",
                  active ? "bg-accent-400/10 text-accent-300 ring-1 ring-accent-400/40" : "text-muted hover:bg-surface-2/60 hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-muted/75 text-muted md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            <Icon name={open ? "x" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-canvas/97 px-4 py-3 shadow-2xl backdrop-blur-lg md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3.5 py-3 text-sm font-semibold transition",
                      active ? "bg-accent-400/15 text-accent-300" : "text-muted hover:bg-surface-2/60 hover:text-fg",
                    )}
                  >
                    {item.label}
                    {active && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-400" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
