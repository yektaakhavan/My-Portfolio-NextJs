import { DEFAULT_LOCALE, getDictionary, fmt, type Locale } from "@/i18n";
import type { Profile, Project, Skill } from "./types";

/**
 * Content (bio, project texts, skill names) is stored in English in the normal columns, and
 * Persian in `translations.fa`. Anything not translated falls back to the English text,
 * so a half-translated site never shows empty holes.
 */
const CONTENT_BASE: Locale = "en";

const str = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";
const list = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0;

/*
 * These return the text in ONE language and drop `translations`, so a visitor's page never carries
 * the other language's text along (smaller pages). The admin area reads the raw rows instead.
 */
export function localizeProfile(p: Profile, locale: Locale): Profile {
  const t = locale === CONTENT_BASE ? undefined : p.translations?.[locale];
  if (!t) return { ...p, translations: {} };
  return {
    ...p,
    translations: {},
    name: str(t.name) ? t.name : p.name,
    title: str(t.title) ? t.title : p.title,
    tagline: str(t.tagline) ? t.tagline : p.tagline,
    location: str(t.location) ? t.location : p.location,
    bio: list<string>(t.bio) ? t.bio : p.bio,
    traits: list<string>(t.traits) ? t.traits : p.traits,
    experience: list<Profile["experience"][number]>(t.experience) ? t.experience : p.experience,
    education: list<Profile["education"][number]>(t.education) ? t.education : p.education,
  };
}

export function localizeProject(p: Project, locale: Locale): Project {
  const t = locale === CONTENT_BASE ? undefined : p.translations?.[locale];
  const title = t && str(t.title) ? t.title : p.title;
  const dict = getDictionary(locale);
  return {
    ...p,
    translations: {},
    title,
    description: t && str(t.description) ? t.description : p.description,
    details: t && str(t.details) ? t.details : p.details,
    tags: t && list<string>(t.tags) ? t.tags : p.tags,
    // generic alt text ("X — screenshot 1") is rebuilt in the visitor's language
    images: p.images.map((img, i) =>
      img.auto ? { ...img, alt: fmt(dict.common.screenshotFallback, { title, n: i + 1 }) } : img,
    ),
  };
}

export function localizeSkill(s: Skill, locale: Locale): Skill {
  const t = locale === CONTENT_BASE ? undefined : s.translations?.[locale];
  return { ...s, translations: {}, name: t && str(t.name) ? t.name : s.name };
}

export { DEFAULT_LOCALE };
