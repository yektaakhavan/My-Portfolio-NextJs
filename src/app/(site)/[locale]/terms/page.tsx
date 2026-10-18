import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { getProfile } from "@/lib/data";
import { TermsEn } from "@/content/legal/terms.en";
import { TermsFa } from "@/content/legal/terms.fa";
import { alternatesFor, asLocale } from "@/i18n";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = asLocale((await params).locale);
  return { title: locale === "fa" ? "شرایط استفاده" : "Terms of Use", alternates: alternatesFor(locale, "/terms") };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const p = await getProfile(locale);
  const owner = p?.name ?? (locale === "fa" ? "مالک وب‌سایت" : "the website owner");
  const Page = locale === "fa" ? TermsFa : TermsEn;
  return (
    <PublicShell locale={locale}>
      <Page locale={locale} owner={owner} />
    </PublicShell>
  );
}
