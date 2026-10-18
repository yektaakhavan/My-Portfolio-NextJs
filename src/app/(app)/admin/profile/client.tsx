"use client";

import { useState } from "react";
import { ImageDropzone } from "@/components/image-dropzone";
import Link from "next/link";
import { api } from "@/lib/api";
import { splitList } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import { useToast } from "@/components/toast";
import { Icon } from "@/components/icons";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import { EMPTY_FA, PersianSection, type FaDraft } from "./persian-section";

type ExpDraft = { role: string; company: string; period: string; pointsText: string };
type EduDraft = { degree: string; school: string; period: string };

type FormState = {
  name: string;
  title: string;
  tagline: string;
  avatarUrl: string;
  avatarAlt: string;
  location: string;
  bioText: string;
  traitsText: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  telegramUrl: string;
  resumeUrl: string;
  resumeTagsText: string;
  experience: ExpDraft[];
  education: EduDraft[];
};

const DEFAULTS: FormState = {
  name: "",
  title: "",
  tagline: "",
  avatarUrl: "",
  avatarAlt: "",
  location: "",
  bioText: "",
  traitsText: "",
  email: "",
  phone: "",
  githubUrl: "",
  linkedinUrl: "",
  telegramUrl: "",
  resumeUrl: "/resume",
  resumeTagsText: "",
  experience: [],
  education: [],
};

function fromProfile(p: Profile | null): FormState {
  if (!p) return DEFAULTS;
  return {
    name: p.name,
    title: p.title,
    tagline: p.tagline,
    avatarUrl: p.avatarUrl,
    avatarAlt: p.avatarAlt,
    location: p.location,
    bioText: p.bio.join("\n\n"),
    traitsText: p.traits.join(", "),
    email: p.email,
    phone: p.phone,
    githubUrl: p.githubUrl,
    linkedinUrl: p.linkedinUrl,
    telegramUrl: p.telegramUrl,
    resumeUrl: p.resumeUrl,
    resumeTagsText: p.resumeTags.join(", "),
    experience: p.experience.map((e) => ({ ...e, pointsText: e.points.join("\n") })),
    education: p.education.map((e) => ({ ...e })),
  };
}

function faFromProfile(p: Profile | null): FaDraft {
  const t = p?.translations?.fa;
  if (!t) return EMPTY_FA;
  return {
    name: t.name ?? "",
    title: t.title ?? "",
    tagline: t.tagline ?? "",
    location: t.location ?? "",
    bioText: (t.bio ?? []).join("\n\n"),
    traitsText: (t.traits ?? []).join("، "),
    experience: (t.experience ?? []).map((e) => ({ ...e, pointsText: e.points.join("\n") })),
    education: (t.education ?? []).map((e) => ({ ...e })),
  };
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="font-display text-lg text-fg">{title}</h2>
        {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
      </div>
      {children}
    </Card>
  );
}

export default function ProfileClient({ initial }: { initial: Profile | null }) {
  const toast = useToast();
  const [form, setForm] = useState<FormState | null>(fromProfile(initial));
  const [fa, setFa] = useState<FaDraft>(faFromProfile(initial));
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(initial ? new Date(initial.updatedAt).toLocaleString() : null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  function updateExp(i: number, patch: Partial<ExpDraft>) {
    setForm((f) =>
      f ? { ...f, experience: f.experience.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) } : f,
    );
  }
  function updateEdu(i: number, patch: Partial<EduDraft>) {
    setForm((f) =>
      f ? { ...f, education: f.education.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) } : f,
    );
  }

  async function save() {
    if (!form) return;
    if (!form.name.trim() || !form.title.trim()) {
      toast({ tone: "error", title: "Name and title are required" });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      title: form.title.trim(),
      tagline: form.tagline.trim(),
      avatarUrl: form.avatarUrl.trim(),
      avatarAlt: form.avatarAlt.trim(),
      location: form.location.trim(),
      bio: form.bioText.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
      traits: splitList(form.traitsText),
      email: form.email.trim(),
      phone: form.phone.trim(),
      githubUrl: form.githubUrl.trim(),
      linkedinUrl: form.linkedinUrl.trim(),
      telegramUrl: form.telegramUrl.trim(),
      resumeUrl: form.resumeUrl.trim() || "/resume",
      resumeTags: splitList(form.resumeTagsText),
      experience: form.experience
        .filter((e) => e.role.trim() || e.company.trim())
        .map((e) => ({
          role: e.role.trim(),
          company: e.company.trim(),
          period: e.period.trim(),
          points: e.pointsText.split("\n").map((s) => s.trim()).filter(Boolean),
        })),
      education: form.education
        .filter((e) => e.degree.trim())
        .map((e) => ({ degree: e.degree.trim(), school: e.school.trim(), period: e.period.trim() })),
      translations: {
        fa: {
          name: fa.name.trim(),
          title: fa.title.trim(),
          tagline: fa.tagline.trim(),
          location: fa.location.trim(),
          bio: fa.bioText.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean),
          traits: fa.traitsText.split(/[,،]/).map((x) => x.trim()).filter(Boolean),
          experience: fa.experience
            .filter((e) => e.role.trim() || e.company.trim())
            .map((e) => ({ role: e.role.trim(), company: e.company.trim(), period: e.period.trim(), points: e.pointsText.split("\n").map((x) => x.trim()).filter(Boolean) })),
          education: fa.education
            .filter((e) => e.degree.trim())
            .map((e) => ({ degree: e.degree.trim(), school: e.school.trim(), period: e.period.trim() })),
        },
      },
    };
    try {
      const d = await api<{ profile: Profile }>("/api/admin/profile", { method: "PUT", json: payload });
      setLastSaved(new Date(d.profile.updatedAt).toLocaleString());
      toast({ tone: "success", title: "Profile saved", detail: "The public portfolio now reflects your changes." });
    } catch (err) {
      toast({ tone: "error", title: "Could not save profile", detail: err instanceof Error ? err.message : undefined });
    } finally {
      setSaving(false);
    }
  }

  if (!form) return null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted">
          {lastSaved ? <>Last saved {lastSaved}</> : "Not saved yet"}
        </div>
        <div className="flex items-center gap-2">
          <Button href="/resume" external variant="outline" size="sm" icon="eye">
              View resume
            </Button>
          <Button icon="check" loading={saving} onClick={save}>
            {saving ? "Saving..." : "Save profile"}
          </Button>
        </div>
      </div>

      <Section title="Identity" hint="Your name, headline and portrait shown in the hero and about sections.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Title / headline" required>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Tagline">
            <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field label="Location">
            <Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="City, Country" />
          </Field>
          <div className="sm:col-span-2">
            <ImageDropzone
              single
              label="Portrait photo"
              images={form.avatarUrl ? [{ url: form.avatarUrl, alt: form.avatarAlt }] : []}
              onChange={(imgs) => {
                set("avatarUrl", imgs[0]?.url ?? "");
                set("avatarAlt", imgs[0]?.alt ?? "");
              }}
            />
          </div>
        </div>
      </Section>

      <Section title="About" hint="Each blank-line separated block becomes a paragraph. Traits are comma separated chips.">
        <div className="space-y-4">
          <Field label="Bio paragraphs">
            <Textarea value={form.bioText} onChange={(e) => set("bioText", e.target.value)} className="min-h-[9rem]" />
          </Field>
          <Field label="Trait chips">
            <Input value={form.traitsText} onChange={(e) => set("traitsText", e.target.value)} placeholder="Fast Learner, Problem Solver, Team Friendly" />
          </Field>
        </div>
      </Section>

      <Section title="Contact & links" hint="Used by the contact section and the floating social rail.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email">
            <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="GitHub URL">
            <Input value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} />
          </Field>
          <Field label="LinkedIn URL">
            <Input value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} />
          </Field>
          <Field label="Telegram URL">
            <Input value={form.telegramUrl} onChange={(e) => set("telegramUrl", e.target.value)} />
          </Field>
        </div>
      </Section>

      <Section title="Experience" hint="Shown on the printable resume page.">
        <div className="space-y-4">
          {form.experience.length === 0 && (
            <p className="rounded-lg border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
              No experience entries yet.
            </p>
          )}
          {form.experience.map((exp, i) => (
            <div key={i} className="rounded-xl border border-line bg-canvas/50 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Role">
                  <Input value={exp.role} onChange={(e) => updateExp(i, { role: e.target.value })} />
                </Field>
                <Field label="Company">
                  <Input value={exp.company} onChange={(e) => updateExp(i, { company: e.target.value })} />
                </Field>
                <Field label="Period">
                  <Input value={exp.period} onChange={(e) => updateExp(i, { period: e.target.value })} placeholder="2023 — Present" />
                </Field>
              </div>
              <div className="mt-3">
                <Field label="Highlights" hint="one per line">
                  <Textarea value={exp.pointsText} onChange={(e) => updateExp(i, { pointsText: e.target.value })} className="min-h-[5rem]" />
                </Field>
              </div>
              <Button
                variant="danger"
                size="sm"
                icon="trash"
                className="mt-3"
                onClick={() => set("experience", form.experience.filter((_, idx) => idx !== i))}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            variant="soft"
            size="sm"
            icon="plus"
            onClick={() =>
              set("experience", [...form.experience, { role: "", company: "", period: "", pointsText: "" }])
            }
          >
            Add experience
          </Button>
        </div>
      </Section>

      <Section title="Education" hint="Shown on the printable resume page.">
        <div className="space-y-4">
          {form.education.length === 0 && (
            <p className="rounded-lg border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
              No education entries yet.
            </p>
          )}
          {form.education.map((ed, i) => (
            <div key={i} className="rounded-xl border border-line bg-canvas/50 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Degree">
                  <Input value={ed.degree} onChange={(e) => updateEdu(i, { degree: e.target.value })} />
                </Field>
                <Field label="School">
                  <Input value={ed.school} onChange={(e) => updateEdu(i, { school: e.target.value })} />
                </Field>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Field label="Period">
                      <Input value={ed.period} onChange={(e) => updateEdu(i, { period: e.target.value })} />
                    </Field>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    icon="trash"
                    onClick={() => set("education", form.education.filter((_, idx) => idx !== i))}
                    aria-label="Remove education entry"
                  >
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="soft"
            size="sm"
            icon="plus"
            onClick={() => set("education", [...form.education, { degree: "", school: "", period: "" }])}
          >
            Add education
          </Button>
        </div>
      </Section>

      <PersianSection fa={fa} setFa={setFa} english={{ experience: form.experience, education: form.education }} />

      <Section title="Resume" hint="Tags shown under the resume card; the resume page renders live from your data.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Resume page URL">
            <Input value={form.resumeUrl} onChange={(e) => set("resumeUrl", e.target.value)} />
          </Field>
          <Field label="Resume tags" hint="comma separated">
            <Input value={form.resumeTagsText} onChange={(e) => set("resumeTagsText", e.target.value)} />
          </Field>
        </div>
      </Section>

      <div className="flex items-center justify-end gap-2 pb-4">
        <span className="mr-auto inline-flex items-center gap-1.5 text-xs text-muted">
          <Icon name="spark" className="h-3.5 w-3.5 text-accent-300" />
          Changes publish to the live site instantly.
        </span>
        <Button icon="check" loading={saving} onClick={save}>
          {saving ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </div>
  );
}
