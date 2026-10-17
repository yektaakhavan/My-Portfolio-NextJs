"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { Icon, type IconName } from "./icons";
import { ThemeToggle } from "./theme-toggle";
import { useFocusTrap } from "./use-focus-trap";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Overview", icon: "dashboard" },
  { href: "/admin/moderation", label: "Moderation", icon: "shield" },
  { href: "/admin/messages", label: "Inbox", icon: "mail" },
  { href: "/admin/projects", label: "Projects", icon: "folder" },
  { href: "/admin/skills", label: "Skills", icon: "code" },
  { href: "/admin/profile", label: "Profile", icon: "user" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function pageTitle(pathname: string): string {
  return NAV.find((n) => isActive(pathname, n.href))?.label ?? "Dashboard";
}

export function AdminShell({
  user,
  pending,
  children,
}: {
  user: { name: string; email: string };
  /** number of public messages waiting for approval */
  pending: number;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  useFocusTrap(drawer, drawerRef, () => setDrawer(false));

  async function logout() {
    setLoggingOut(true);
    try {
      await api("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  const nav = (label: string) => (
    <nav aria-label={label} className="flex flex-1 flex-col gap-1 px-3">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        const badge = item.href === "/admin/moderation" && pending > 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setDrawer(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition",
              active ? "bg-accent-400/12 text-accent-300 ring-1 ring-accent-400/40" : "text-muted hover:bg-surface-2/70 hover:text-fg",
            )}
          >
            <Icon name={item.icon} className="h-4 w-4" />
            {item.label}
            {badge && (
              <span className="ml-auto rounded-full bg-accent-400 px-2 py-0.5 text-[11px] font-bold text-on-accent">
                {pending}
                <span className="sr-only"> waiting for approval</span>
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-3 px-5 py-5">
      <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-surface-3 font-display text-lg text-accent-300 ring-1 ring-accent-400/40">
        {user.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}
      </span>
      <div className="min-w-0">
        <p className="truncate font-display text-base text-fg">{user.name}</p>
        <p className="truncate text-xs text-muted">{user.email}</p>
      </div>
    </div>
  );

  const bottom = (
    <div className="space-y-1 border-t border-line px-3 py-3">
      <Link href="/" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-muted transition hover:bg-surface-2/70 hover:text-fg">
        <Icon name="globe" className="h-4 w-4" />
        View public site
      </Link>
      <button
        type="button"
        onClick={logout}
        disabled={loggingOut}
        className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-muted transition hover:bg-danger/10 hover:text-danger disabled:opacity-50"
      >
        <Icon name="logout" className="h-4 w-4" />
        {loggingOut ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <a href="#main" className="skip-link">Skip to main content</a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-surface/60 lg:flex">
        {brand}
        {nav("Admin")}
        {bottom}
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-canvas-deep/80 backdrop-blur-sm" onClick={() => setDrawer(false)} aria-hidden />
          <aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Admin menu"
            className="modal-panel absolute inset-y-0 left-0 flex w-72 flex-col border-r border-line bg-surface"
          >
            <div className="flex items-start justify-between">
              {brand}
              <button type="button" onClick={() => setDrawer(false)} aria-label="Close menu" className="m-3 rounded-lg p-2 text-muted hover:text-fg">
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>
            {nav("Admin (mobile)")}
            {bottom}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-canvas/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-muted/75 p-2 text-muted lg:hidden"
              onClick={() => setDrawer(true)}
              aria-label="Open admin menu"
              aria-haspopup="dialog"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
            <h1 className="font-display text-xl text-fg">{pageTitle(pathname)}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/" className="hidden items-center gap-2 rounded-lg border border-muted/75 px-3 py-2 text-xs font-semibold text-muted transition hover:border-accent-400 hover:text-accent-300 sm:inline-flex">
              <Icon name="external" className="h-3.5 w-3.5" />
              View public site
            </Link>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-8 outline-none sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
