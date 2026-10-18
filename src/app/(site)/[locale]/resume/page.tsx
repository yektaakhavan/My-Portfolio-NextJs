import type { Metadata } from "next";
import Link from "next/link";
import { LocaleLink } from "@/components/locale-link";
import { getProfile, getProjects, getSkills } from "@/lib/data";
import { asLocale, getDictionary } from "@/i18n";
import { PrintButton, PrintTrigger } from "./print-trigger";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { title: getDictionary((await params).locale).resume.metaTitle };
}

export default async function ResumePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale);
  const [row, skillRows, projectRows] = await Promise.all([getProfile(locale), getSkills(locale), getProjects(locale)]);
  const query = await searchParams;

  if (!row) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center text-fg">
        <p>{t.resume.empty}</p>
        <Link href="/admin/profile" className="text-accent-300 underline">
          {t.resume.goProfile}
        </Link>
      </main>
    );
  }

  const categories = ["frontend", "tools", "soft"];
  const h2 = "text-sm font-extrabold tracking-[0.15em] text-[#6b4fbf] uppercase";

  return (
    <main className="mx-auto max-w-3xl bg-white px-8 py-10 text-[#1c1626] shadow-2xl sm:my-8 sm:rounded-xl">
      <PrintTrigger autoPrint={query.print === "1"} />

      <header className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#e5def0] pb-5">
        <div className="flex gap-2">
          <LocaleLink
            href="/"
            className="rounded-lg border border-[#d9cfeb] px-3 py-1.5 text-sm font-semibold text-[#4f3f7a] hover:bg-[#f5f1fb]"
          >
            <span aria-hidden className="inline-block rtl:-scale-x-100">←</span> {t.resume.back}
          </LocaleLink>
        </div>
        <PrintButton label={t.resume.print} />
      </header>

      <header className="border-b-2 border-[#6b4fbf] pb-5">
        <h1 className="font-display text-4xl text-[#2a1c44]">{row.name}</h1>
        <p className="mt-1 text-lg font-semibold text-[#6b4fbf]">{row.title}</p>
        <p dir="auto" className="mt-3 text-sm text-[#5f5870]">{row.tagline}</p>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#5f5870]">
          {row.email && <span dir="ltr">{row.email}</span>}
          {row.phone && <span dir="ltr">{row.phone}</span>}
          {row.location && <span>{row.location}</span>}
          {row.githubUrl && <span dir="ltr">{row.githubUrl.replace("https://", "")}</span>}
        </p>
      </header>

      {row.experience.length > 0 && (
        <section className="mt-6">
          <h2 className={h2}>{t.resume.experience}</h2>
          {row.experience.map((exp) => (
            <div key={exp.role + exp.company} className="mt-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-bold text-[#2a1c44]">{exp.role}</h3>
                <span className="text-xs text-[#5f5870]">{exp.period}</span>
              </div>
              <p className="text-sm font-semibold text-[#4f3f7a]">{exp.company}</p>
              <ul className="mt-1.5 list-disc space-y-1 ps-5 text-sm text-[#3d3652]">
                {exp.points.map((p) => (
                  <li key={p} dir="auto">{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {projectRows.length > 0 && (
        <section className="mt-6">
          <h2 className={h2}>{t.resume.projects}</h2>
          <ul className="mt-3 space-y-2">
            {projectRows.map((p) => (
              <li key={p.id} className="text-sm">
                <span className="font-bold text-[#2a1c44]">{p.title}</span>
                <span className="text-[#3d3652]"> — {p.description}</span>
                <span dir="ltr" className="text-xs text-[#5f5870]"> ({p.tech.join(", ")})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <h2 className={h2}>{t.resume.skills}</h2>
        <div className="mt-3 space-y-2">
          {categories.map((c) => {
            const list = skillRows.filter((s) => s.category === c);
            if (!list.length) return null;
            return (
              <p key={c} className="text-sm">
                <span className="font-bold text-[#2a1c44]">{t.categories[c] ?? c}: </span>
                <span className="text-[#3d3652]">{list.map((s) => `${s.name} (${t.levels[s.level] ?? s.level})`).join(locale === "fa" ? "، " : ", ")}</span>
              </p>
            );
          })}
        </div>
      </section>

      {row.education.length > 0 && (
        <section className="mt-6">
          <h2 className={h2}>{t.resume.education}</h2>
          {row.education.map((ed) => (
            <div key={ed.degree} className="mt-2 flex flex-wrap items-baseline justify-between gap-2 text-sm">
              <div>
                <span className="font-bold text-[#2a1c44]">{ed.degree}</span>
                <span className="text-[#3d3652]"> — {ed.school}</span>
              </div>
              <span className="text-xs text-[#5f5870]">{ed.period}</span>
            </div>
          ))}
        </section>
      )}

      <footer className="mt-8 border-t border-[#e5def0] pt-4 text-center text-xs text-[#5f5870]">{t.resume.footer}</footer>
    </main>
  );
}
