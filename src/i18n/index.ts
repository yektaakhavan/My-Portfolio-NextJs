import { DEFAULT_LOCALE, LOCALES, LOCALE_META, isLocale, withLocale, type Locale } from "./config";
import { en, type Dictionary } from "./messages/en";
import { fa } from "./messages/fa";

export * from "./config";
export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { en, fa };

export function getDictionary(locale: string | undefined | null): Dictionary {
  return dictionaries[isLocale(locale) ? locale : DEFAULT_LOCALE];
}

/** "Showing {a} of {b}" + { a: 3, b: 8 } → "Showing 3 of 8" */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}

export function formatNumber(locale: Locale, n: number): string {
  return new Intl.NumberFormat(LOCALE_META[locale].intl).format(n);
}

export function formatDate(locale: Locale, iso: string, style: "long" | "short" = "short"): string {
  return new Date(iso).toLocaleDateString(LOCALE_META[locale].intl, {
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  });
}

/** Reads the [locale] route param; unknown values fall back to the default language. */
export function asLocale(raw: string | undefined): Locale {
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

/** hreflang + canonical for one page, e.g. alternatesFor("fa", "/about"). Search engines use this to link the language versions. */
export function alternatesFor(locale: Locale, path: string) {
  return {
    canonical: withLocale(locale, path),
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, withLocale(l, path)])),
      "x-default": withLocale(DEFAULT_LOCALE, path),
    },
  };
}
