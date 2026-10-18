import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "@fontsource-variable/manrope";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/vazirmatn";
import { RootDocument } from "@/components/root-document";
import { ToastProvider } from "@/components/toast";
import { getProfile } from "@/lib/data";
import { LOCALES, LOCALE_META, getDictionary, isLocale, withLocale, type Locale } from "@/i18n";
import { I18nProvider } from "@/i18n/provider";
import "@/app/globals.css";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
// unknown languages (/xx/...) are rejected with notFound() in the layout below.
// (Do NOT set dynamicParams = false here: it makes revalidated pages return 404 instead of regenerating.)

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#140d24" },
    { media: "(prefers-color-scheme: light)", color: "#faf7ff" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;
  const profile = await getProfile(locale).catch(() => null);
  const name = profile?.name ?? "Portfolio";
  const title = profile?.title ?? getDictionary(locale).nav.role;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${name} — ${title}`, template: `%s — ${name}` },
    description: profile?.tagline || title,
    openGraph: { type: "website", siteName: name, title: `${name} — ${title}`, locale: LOCALE_META[locale].intl.replace("-", "_") },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  return (
    <RootDocument lang={locale} dir={LOCALE_META[locale].dir}>
      <I18nProvider locale={locale} dict={getDictionary(locale)}>
        <ToastProvider>{children}</ToastProvider>
      </I18nProvider>
    </RootDocument>
  );
}
