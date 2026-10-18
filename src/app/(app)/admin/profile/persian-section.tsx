"use client";

import { Button, Card, Field, Input, Textarea } from "@/components/ui";

export type FaExp = { role: string; company: string; period: string; pointsText: string };
export type FaEdu = { degree: string; school: string; period: string };
export type FaDraft = {
  name: string;
  title: string;
  tagline: string;
  location: string;
  bioText: string;
  traitsText: string;
  experience: FaExp[];
  education: FaEdu[];
};

export const EMPTY_FA: FaDraft = { name: "", title: "", tagline: "", location: "", bioText: "", traitsText: "", experience: [], education: [] };

/**
 * Persian version of the profile text. Anything left empty simply falls back to the English text
 * on the Persian pages, so you can translate step by step.
 */
export function PersianSection({
  fa,
  setFa,
  english,
}: {
  fa: FaDraft;
  setFa: (next: FaDraft) => void;
  english: { experience: FaExp[]; education: FaEdu[] };
}) {
  const set = <K extends keyof FaDraft>(k: K, v: FaDraft[K]) => setFa({ ...fa, [k]: v });
  const rtl = { dir: "rtl" as const, lang: "fa" };

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="font-display text-lg text-fg">
          Persian version <span lang="fa">(فارسی)</span>
        </h2>
        <p className="mt-0.5 text-xs text-muted">
          Shown on the Persian pages (/fa). Leave a field empty to show the English text there. Photo, email, phone and links are shared by both languages.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name (Persian)">
            <Input {...rtl} value={fa.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Title / headline (Persian)">
            <Input {...rtl} value={fa.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Tagline (Persian)">
            <Input {...rtl} value={fa.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field label="Location (Persian)">
            <Input {...rtl} value={fa.location} onChange={(e) => set("location", e.target.value)} />
          </Field>
        </div>
        <Field label="Bio paragraphs (Persian)" hint="Separate paragraphs with a blank line.">
          <Textarea {...rtl} value={fa.bioText} onChange={(e) => set("bioText", e.target.value)} className="min-h-[9rem]" />
        </Field>
        <Field label="Trait chips (Persian)" hint="Comma separated. Use the Persian comma (،) or a normal one.">
          <Input {...rtl} value={fa.traitsText} onChange={(e) => set("traitsText", e.target.value)} />
        </Field>

        <fieldset className="space-y-3 rounded-xl border border-line p-4">
          <legend className="px-2 text-sm font-semibold text-fg">Experience (Persian)</legend>
          {fa.experience.length === 0 && (
            <Button
              variant="soft"
              size="sm"
              icon="plus"
              onClick={() => set("experience", english.experience.map((e) => ({ ...e })))}
              disabled={english.experience.length === 0}
            >
              Copy the English entries here to translate
            </Button>
          )}
          {fa.experience.map((exp, i) => (
            <div key={i} className="rounded-lg border border-line bg-canvas/50 p-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label={`Role ${i + 1}`}>
                  <Input {...rtl} value={exp.role} onChange={(e) => set("experience", fa.experience.map((x, k) => (k === i ? { ...x, role: e.target.value } : x)))} />
                </Field>
                <Field label={`Company ${i + 1}`}>
                  <Input {...rtl} value={exp.company} onChange={(e) => set("experience", fa.experience.map((x, k) => (k === i ? { ...x, company: e.target.value } : x)))} />
                </Field>
                <Field label={`Period ${i + 1}`}>
                  <Input {...rtl} value={exp.period} onChange={(e) => set("experience", fa.experience.map((x, k) => (k === i ? { ...x, period: e.target.value } : x)))} />
                </Field>
              </div>
              <div className="mt-3">
                <Field label={`Highlights ${i + 1}`} hint="One per line.">
                  <Textarea {...rtl} value={exp.pointsText} onChange={(e) => set("experience", fa.experience.map((x, k) => (k === i ? { ...x, pointsText: e.target.value } : x)))} className="min-h-[5rem]" />
                </Field>
              </div>
              <Button variant="danger" size="sm" icon="trash" className="mt-3" onClick={() => set("experience", fa.experience.filter((_, k) => k !== i))}>
                Remove<span className="sr-only"> Persian experience {i + 1}</span>
              </Button>
            </div>
          ))}
          {fa.experience.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => set("experience", [])}>
              Clear all Persian experience (use English)
            </Button>
          )}
        </fieldset>

        <fieldset className="space-y-3 rounded-xl border border-line p-4">
          <legend className="px-2 text-sm font-semibold text-fg">Education (Persian)</legend>
          {fa.education.length === 0 && (
            <Button
              variant="soft"
              size="sm"
              icon="plus"
              onClick={() => set("education", english.education.map((e) => ({ ...e })))}
              disabled={english.education.length === 0}
            >
              Copy the English entries here to translate
            </Button>
          )}
          {fa.education.map((ed, i) => (
            <div key={i} className="grid gap-3 rounded-lg border border-line bg-canvas/50 p-3 sm:grid-cols-3">
              <Field label={`Degree ${i + 1}`}>
                <Input {...rtl} value={ed.degree} onChange={(e) => set("education", fa.education.map((x, k) => (k === i ? { ...x, degree: e.target.value } : x)))} />
              </Field>
              <Field label={`School ${i + 1}`}>
                <Input {...rtl} value={ed.school} onChange={(e) => set("education", fa.education.map((x, k) => (k === i ? { ...x, school: e.target.value } : x)))} />
              </Field>
              <Field label={`Period ${i + 1}`}>
                <Input {...rtl} value={ed.period} onChange={(e) => set("education", fa.education.map((x, k) => (k === i ? { ...x, period: e.target.value } : x)))} />
              </Field>
            </div>
          ))}
          {fa.education.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => set("education", [])}>
              Clear all Persian education (use English)
            </Button>
          )}
        </fieldset>
      </div>
    </Card>
  );
}
