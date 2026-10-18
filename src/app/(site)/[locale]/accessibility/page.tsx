import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { AccessibilityEn } from "@/content/legal/accessibility.en";
import { AccessibilityFa } from "@/content/legal/accessibility.fa";
import { alternatesFor, asLocale } from "@/i18n";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  return { title: locale === "fa" ? "بیانیه‌ی دسترس‌پذیری" : "Accessibility Statement", alternates: alternatesFor(locale, "/accessibility") };
}

export default async function AccessibilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const Page = locale === "fa" ? AccessibilityFa : AccessibilityEn;
  return (
    <PublicShell locale={locale}>
      <Page locale={locale} />
    </PublicShell>
  );
}
