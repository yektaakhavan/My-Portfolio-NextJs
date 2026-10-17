import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { profile, projects, skills } from "@/db/schema";
import { CATEGORY_LABELS } from "@/lib/types";
import { PrintButton, PrintTrigger } from "./print-trigger";

export const dynamic = "force-dynamic";

export const metadata = { title: "Resume" };

export default async function ResumePage({
  searchParams,
}: {
  searchParams: Promise<{ print?: string }>;
}) {
  const [row] = await db.select().from(profile).limit(1);
  const [skillRows, projectRows] = await Promise.all([
    db.select().from(skills).orderBy(asc(skills.sort)),
    db.select().from(projects).orderBy(asc(projects.sort)),
  ]);
  const params = await searchParams;

  if (!row) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center text-white">
        <p>No resume data yet. Add it from the admin dashboard.</p>
        <Link href="/admin/profile" className="text-accent-300 underline">
          Go to profile settings
        </Link>
      </main>
    );
  }

  const categories = ["frontend", "tools", "soft"];

  return (
    <main className="mx-auto max-w-3xl bg-white px-8 py-10 text-[#1c1626] shadow-2xl sm:my-8 sm:rounded-xl">
      <PrintTrigger autoPrint={params.print === "1"} />

      <header className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#e5def0] pb-5">
        <div className="flex gap-2">
          <Link
            href="/"
            className="rounded-lg border border-[#d9cfeb] px-3 py-1.5 text-sm font-semibold text-[#4f3f7a] hover:bg-[#f5f1fb]"
          >
            <span aria-hidden>←</span> Back to site
          </Link>
        </div>
        <PrintButton />
      </header>

      <header className="border-b-2 border-[#6b4fbf] pb-5">
        <h1 className="font-display text-4xl text-[#2a1c44]">{row.name}</h1>
        <p className="mt-1 text-lg font-semibold text-[#6b4fbf]">{row.title}</p>
        <p className="mt-3 text-sm text-[#5f5870]">{row.tagline}</p>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#5f5870]">
          {row.email && <span>{row.email}</span>}
          {row.phone && <span>{row.phone}</span>}
          {row.location && <span>{row.location}</span>}
          {row.githubUrl && <span>{row.githubUrl.replace("https://", "")}</span>}
        </p>
      </header>

      {row.experience.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-extrabold tracking-[0.15em] text-[#6b4fbf] uppercase">
            Experience
          </h2>
          {row.experience.map((exp) => (
            <div key={exp.role + exp.company} className="mt-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-bold text-[#2a1c44]">{exp.role}</h3>
                <span className="text-xs text-[#5f5870]">{exp.period}</span>
              </div>
              <p className="text-sm font-semibold text-[#4f3f7a]">{exp.company}</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-[#3d3652]">
                {exp.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {projectRows.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-extrabold tracking-[0.15em] text-[#6b4fbf] uppercase">
            Selected Projects
          </h2>
          <ul className="mt-3 space-y-2">
            {projectRows.map((p) => (
              <li key={p.id} className="text-sm">
                <span className="font-bold text-[#2a1c44]">{p.title}</span>
                <span className="text-[#3d3652]"> — {p.description}</span>
                <span className="text-xs text-[#5f5870]"> ({p.tech.join(", ")})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-sm font-extrabold tracking-[0.15em] text-[#6b4fbf] uppercase">Skills</h2>
        <div className="mt-3 space-y-2">
          {categories.map((c) => {
            const list = skillRows.filter((s) => s.category === c);
            if (!list.length) return null;
            return (
              <p key={c} className="text-sm">
                <span className="font-bold text-[#2a1c44]">{CATEGORY_LABELS[c] ?? c}: </span>
                <span className="text-[#3d3652]">
                  {list.map((s) => `${s.name} (${s.level})`).join(", ")}
                </span>
              </p>
            );
          })}
        </div>
      </section>

      {row.education.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-extrabold tracking-[0.15em] text-[#6b4fbf] uppercase">
            Education
          </h2>
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

      <footer className="mt-8 border-t border-[#e5def0] pt-4 text-center text-xs text-[#5f5870]">
        References available upon request · Generated from live portfolio data
      </footer>
    </main>
  );
}
