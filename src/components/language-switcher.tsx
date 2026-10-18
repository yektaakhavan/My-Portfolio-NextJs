"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { fmt } from "@/i18n";
import { LOCALES, LOCALE_META, splitLocale, withLocale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * Shows the OTHER language(s) as links to the very same page ("/about" ⇄ "/fa/about").
 * Real links (not buttons): they work without JavaScript, can be opened in a new tab and are crawlable.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const { path } = splitLocale(pathname);

  return (
    <>
      {LOCALES.filter((l) => l !== locale).map((l) => (
        <Link
          key={l}
          href={withLocale(l, path)}
          hrefLang={l}
          lang={l}
          // the accessible name is spoken in the TARGET language so a screen reader pronounces it correctly
          aria-label={fmt(t.common.switchLanguage, { name: LOCALE_META[l].label })}
          title={LOCALE_META[l].label}
          className={cn(
            "inline-flex h-9 items-center justify-center rounded-lg border border-muted/75 px-3 text-xs font-bold text-muted transition hover:border-accent-400 hover:text-accent-300",
            className,
          )}
        >
          {LOCALE_META[l].label}
        </Link>
      ))}
    </>
  );
}

