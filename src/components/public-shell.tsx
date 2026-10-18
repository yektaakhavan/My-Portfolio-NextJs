import Link from "next/link";
import type { ReactNode } from "react";
import { getProfile } from "@/lib/data";
import { fmt, getDictionary, type Locale } from "@/i18n";
import { LocaleLink } from "./locale-link";
import type { Profile } from "@/lib/types";
import { Icon, type IconName } from "./icons";
import { PublicHeader } from "./public-header";

function SocialRail({ profile, locale }: { profile: Profile | null; locale: Locale }) {
  if (!profile) return null;
  const t = getDictionary(locale);
  const all: { href: string; icon: IconName; label: string }[] = [
    { href: profile.githubUrl, icon: "github", label: "GitHub" },
    { href: profile.linkedinUrl, icon: "linkedin", label: "LinkedIn" },
    { href: profile.telegramUrl, icon: "send", label: "Telegram" },
    { href: profile.email ? `mailto:${profile.email}` : "", icon: "mail", label: t.footer.email },
  ];
  const items = all.filter((i) => i.href);
  if (!items.length) return null;

  return (
    <nav
      aria-label={t.footer.social}
      className="fixed top-1/2 start-4 z-40 hidden -translate-y-1/2 flex-col gap-1 rounded-2xl border border-line bg-surface/90 p-1.5 shadow-xl backdrop-blur-md lg:flex"
    >
      {items.map((i) => (
        <a
          key={i.label}
          href={i.href}
          {...(i.href.startsWith("mailto") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          aria-label={i.href.startsWith("mailto") ? i.label : `${i.label} ${t.common.opensInNewTab}`}
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

export function PublicFooter({ profile, locale }: { profile: Profile | null; locale: Locale }) {
  const t = getDictionary(locale);
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
              {fmt(t.footer.rights, { year: new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en", { useGrouping: false }).format(new Date().getFullYear()), name })}
            </p>
          </div>
          <nav aria-label={t.footer.footerNav} className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-muted">
            <LocaleLink href="/about" className="hover:text-accent-300">{t.nav.about}</LocaleLink>
            <LocaleLink href="/projects" className="hover:text-accent-300">{t.nav.projects}</LocaleLink>
            <LocaleLink href="/messages" className="hover:text-accent-300">{t.nav.messages}</LocaleLink>
            <LocaleLink href="/contact" className="hover:text-accent-300">{t.nav.contact}</LocaleLink>
          </nav>
        </div>
        <nav
          aria-label={t.footer.legalNav}
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-line pt-6 text-sm text-muted sm:justify-between"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <LocaleLink href="/privacy" className="underline-offset-4 hover:text-accent-300 hover:underline">{t.footer.privacy}</LocaleLink>
            <LocaleLink href="/cookies" className="underline-offset-4 hover:text-accent-300 hover:underline">{t.footer.cookies}</LocaleLink>
            <LocaleLink href="/terms" className="underline-offset-4 hover:text-accent-300 hover:underline">{t.footer.terms}</LocaleLink>
            <LocaleLink href="/accessibility" className="underline-offset-4 hover:text-accent-300 hover:underline">{t.footer.accessibility}</LocaleLink>
          </div>
          <Link href="/login" className="underline-offset-4 hover:text-accent-300 hover:underline">{t.footer.ownerSignIn}</Link>
        </nav>
      </div>
    </footer>
  );
}

/** Server component: data is read straight from the database, so HTML arrives complete (no loading spinners). */
export async function PublicShell({ children, locale }: { children: ReactNode; locale: Locale }) {
  const profile = await getProfile(locale);
  const t = getDictionary(locale);
  return (
    <div className="starfield min-h-screen">
      <a href="#main" className="skip-link">
        {t.common.skipToContent}
      </a>
      <PublicHeader name={profile?.name ?? "Portfolio"} />
      <SocialRail profile={profile} locale={locale} />
      <main id="main" tabIndex={-1} className="fade-up pt-20 outline-none">
        {children}
      </main>
      <PublicFooter profile={profile} locale={locale} />
    </div>
  );
}
