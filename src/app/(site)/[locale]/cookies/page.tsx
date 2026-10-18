import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { CookiesEn } from "@/content/legal/cookies.en";
import { CookiesFa } from "@/content/legal/cookies.fa";
import { alternatesFor, asLocale } from "@/i18n";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  return { title: locale === "fa" ? "سیاست کوکی‌ها" : "Cookie Policy", alternates: alternatesFor(locale, "/cookies") };
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const Page = locale === "fa" ? CookiesFa : CookiesEn;
  return (
    <PublicShell locale={locale}>
      <Page locale={locale} />
    </PublicShell>
  );
}
