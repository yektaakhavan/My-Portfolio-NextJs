"use client";

import { createContext, useContext, type ReactNode } from "react";
import { LOCALE_META, withLocale, type Locale } from "./config";
import { en, type Dictionary } from "./messages/en";

type Ctx = { locale: Locale; t: Dictionary };

// Outside the public site (admin, sign-in) the interface stays English.
const I18nContext = createContext<Ctx>({ locale: "en", t: en });

export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: dict }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const { locale, t } = useContext(I18nContext);
  return { locale, t, dir: LOCALE_META[locale].dir, href: (path: string) => withLocale(locale, path) };
}
