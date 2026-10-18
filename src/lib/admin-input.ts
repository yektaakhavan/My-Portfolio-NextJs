import type { ProfileText, ProjectText, SkillText, StoredImage, Translations } from "@/db/schema";
import { cleanText, safeMediaUrl } from "./validators";

/** Accepts ["a", "b"] and returns a clean, de-duplicated, length-capped list. */
export function strList(value: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const v of value) {
    const t = cleanText(v, maxLen);
    if (t && !out.includes(t)) out.push(t);
    if (out.length >= maxItems) break;
  }
  return out;
}

/** Accepts [{url, alt}] (or legacy plain URL strings); drops unsafe URLs. */
export function parseImages(value: unknown): StoredImage[] {
  if (!Array.isArray(value)) return [];
  const out: StoredImage[] = [];
  for (const v of value.slice(0, 20)) {
    const raw = typeof v === "string" ? { url: v, alt: "" } : (v as { url?: unknown; alt?: unknown });
    const url = safeMediaUrl(raw?.url);
    if (!url) continue;
    out.push({ url, alt: cleanText(raw?.alt, 200) });
  }
  return out;
}

/* ---------- translations (Persian version of the content) ---------- */

const txt = (v: unknown, max: number) => cleanText(v, max);

export function parseProfileTranslations(value: unknown): Translations<ProfileText> {
  const fa = (value as { fa?: Record<string, unknown> } | null)?.fa;
  if (!fa || typeof fa !== "object") return {};
  const out: Partial<ProfileText> = {};
  if (typeof fa.name === "string") out.name = txt(fa.name, 120);
  if (typeof fa.title === "string") out.title = txt(fa.title, 160);
  if (typeof fa.tagline === "string") out.tagline = txt(fa.tagline, 600);
  if (typeof fa.location === "string") out.location = txt(fa.location, 120);
  if (Array.isArray(fa.bio)) out.bio = strList(fa.bio, 12, 2000);
  if (Array.isArray(fa.traits)) out.traits = strList(fa.traits, 12, 80);
  if (Array.isArray(fa.experience)) {
    out.experience = fa.experience.slice(0, 20).map((e) => {
      const x = (e ?? {}) as Record<string, unknown>;
      return { role: txt(x.role, 160), company: txt(x.company, 160), period: txt(x.period, 80), points: strList(x.points, 20, 600) };
    });
  }
  if (Array.isArray(fa.education)) {
    out.education = fa.education.slice(0, 20).map((e) => {
      const x = (e ?? {}) as Record<string, unknown>;
      return { degree: txt(x.degree, 200), school: txt(x.school, 200), period: txt(x.period, 80) };
    });
  }
  return { fa: out };
}

export function parseProjectTranslations(value: unknown): Translations<ProjectText> {
  const fa = (value as { fa?: Record<string, unknown> } | null)?.fa;
  if (!fa || typeof fa !== "object") return {};
  const out: Partial<ProjectText> = {};
  if (typeof fa.title === "string") out.title = txt(fa.title, 160);
  if (typeof fa.description === "string") out.description = txt(fa.description, 2000);
  if (typeof fa.details === "string") out.details = txt(fa.details, 20000);
  if (Array.isArray(fa.tags)) out.tags = strList(fa.tags, 12, 40);
  return { fa: out };
}

export function parseSkillTranslations(value: unknown): Translations<SkillText> {
  const fa = (value as { fa?: Record<string, unknown> } | null)?.fa;
  if (!fa || typeof fa !== "object") return {};
  return { fa: typeof fa.name === "string" ? { name: txt(fa.name, 80) } : {} };
}
