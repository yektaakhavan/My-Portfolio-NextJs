/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LANGUAGES — everything about languages is configured in this one file.
 *
 *  ⭐ TO CHANGE THE DEFAULT LANGUAGE: edit DEFAULT_LOCALE below ("en" or "fa"),
 *     then run `npm run build` again (or restart `npm run dev`). That's all.
 *
 *  What "default" means:
 *   - the default language lives at the plain address     →  /about, /projects/my-app
 *   - the other language lives under its own prefix       →  /fa/about, /fa/projects/my-app
 *   - the prefixed address of the default language (/en/about) redirects to the plain one
 *   - the site's first screen (/) is always in the default language
 *
 *  To add another language later: add its code to LOCALES, add a LOCALE_META entry,
 *  and copy src/i18n/messages/en.ts to a new file (see README-CHANGES.md).
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const LOCALES = ["en", "fa"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en"; // ⭐ <— change to "fa" to make Persian the default

export const LOCALE_META: Record<
  Locale,
  {
    /** how the language names itself (shown in the language switcher) */
    label: string;
    /** accessible name used in English UI, e.g. for screen readers */
    englishName: string;
    dir: "ltr" | "rtl";
    /** BCP-47 tag for Intl (dates / numbers) */
    intl: string;
  }
> = {
  en: { label: "English", englishName: "English", dir: "ltr", intl: "en-GB" },
  fa: { label: "فارسی", englishName: "Persian", dir: "rtl", intl: "fa-IR" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** Paths that are NOT translated (admin, API, uploaded files, sign-in). */
const NEUTRAL = /^\/(admin|api|login|uploads|_next)(\/|$)/;

/** Builds a link in the given language: "/about" → "/about" (default) or "/fa/about". */
export function withLocale(locale: Locale, path: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || NEUTRAL.test(path)) return path;
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Splits "/fa/projects/x" into { locale: "fa", path: "/projects/x" } (locale undefined for unprefixed paths). */
export function splitLocale(pathname: string): { locale: Locale | undefined; path: string } {
  const [, first = "", ...rest] = pathname.split("/");
  if (isLocale(first)) return { locale: first, path: "/" + rest.join("/") };
  return { locale: undefined, path: pathname || "/" };
}

/** Which language a pathname is in (unprefixed = default language). */
export function localeOfPath(pathname: string): Locale {
  return splitLocale(pathname).locale ?? DEFAULT_LOCALE;
}
