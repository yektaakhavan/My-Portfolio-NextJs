import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { getProfile } from "@/lib/data";
import { PrivacyEn } from "@/content/legal/privacy.en";
import { PrivacyFa } from "@/content/legal/privacy.fa";
import { alternatesFor, asLocale } from "@/i18n";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  return { title: locale === "fa" ? "سیاست حریم خصوصی" : "Privacy Policy", alternates: alternatesFor(locale, "/privacy") };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const p = await getProfile(locale);
  const owner = p?.name ?? (locale === "fa" ? "مالک وب‌سایت" : "the website owner");
  const mail = p?.email;
  const Page = locale === "fa" ? PrivacyFa : PrivacyEn;
  return (
    <PublicShell locale={locale}>
      <Page locale={locale} owner={owner} mail={mail} />
    </PublicShell>
  );
}
