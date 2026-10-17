import Link from "next/link";
import type { ReactNode } from "react";
import { getProfile } from "@/lib/data";
import type { Profile } from "@/lib/types";
import { Icon, type IconName } from "./icons";
import { PublicHeader } from "./public-header";

function SocialRail({ profile }: { profile: Profile | null }) {
  if (!profile) return null;
  const all: { href: string; icon: IconName; label: string }[] = [
    { href: profile.githubUrl, icon: "github", label: "GitHub" },
    { href: profile.linkedinUrl, icon: "linkedin", label: "LinkedIn" },
    { href: profile.telegramUrl, icon: "send", label: "Telegram" },
    { href: profile.email ? `mailto:${profile.email}` : "", icon: "mail", label: "Email" },
  ];
  const items = all.filter((i) => i.href);
  if (!items.length) return null;

  return (
    <nav
      aria-label="Social links"
      className="fixed top-1/2 left-4 z-40 hidden -translate-y-1/2 flex-col gap-1 rounded-2xl border border-line bg-surface/90 p-1.5 shadow-xl backdrop-blur-md lg:flex"
    >
      {items.map((i) => (
        <a
          key={i.label}
          href={i.href}
          {...(i.href.startsWith("mailto") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          aria-label={i.href.startsWith("mailto") ? i.label : `${i.label} (opens in a new tab)`}
          title={i.label}
          className="rounded-xl p-2.5 text-muted transition hover:bg-surface-2 hover:text-accent-300"
        >
          <Icon name={i.icon} className="h-4 w-4" />
        </a>
      ))}
    </nav>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

export function PublicFooter({ profile }: { profile: Profile | null }) {
  const name = profile?.name ?? "Portfolio";
  return (
    <footer className="mt-20 border-t border-line bg-canvas-deep/70 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-surface-3 font-display text-sm text-accent-300 ring-1 ring-accent-400/40"
            >
              {initials(name)}
            </span>
            <p className="text-sm text-muted">
              © {new Date().getFullYear()} {name}. All rights reserved.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-muted">
            <Link href="/about" className="hover:text-accent-300">About</Link>
            <Link href="/projects" className="hover:text-accent-300">Projects</Link>
            <Link href="/messages" className="hover:text-accent-300">Messages</Link>
            <Link href="/contact" className="hover:text-accent-300">Contact</Link>
          </nav>
        </div>
        <nav
          aria-label="Legal"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-line pt-6 text-sm text-muted sm:justify-between"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="underline-offset-4 hover:text-accent-300 hover:underline">Privacy Policy</Link>
            <Link href="/cookies" className="underline-offset-4 hover:text-accent-300 hover:underline">Cookie Policy</Link>
            <Link href="/terms" className="underline-offset-4 hover:text-accent-300 hover:underline">Terms of Use</Link>
            <Link href="/accessibility" className="underline-offset-4 hover:text-accent-300 hover:underline">Accessibility</Link>
          </div>
          <Link href="/login" className="underline-offset-4 hover:text-accent-300 hover:underline">Owner sign-in</Link>
        </nav>
      </div>
    </footer>
  );
}

/** Server component: data is read straight from the database, so HTML arrives complete (no loading spinners). */
export async function PublicShell({ children }: { children: ReactNode }) {
  const profile = await getProfile();
  return (
    <div className="starfield min-h-screen">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <PublicHeader name={profile?.name ?? "Portfolio"} />
      <SocialRail profile={profile} />
      <main id="main" tabIndex={-1} className="fade-up pt-20 outline-none">
        {children}
      </main>
      <PublicFooter profile={profile} />
    </div>
  );
}
