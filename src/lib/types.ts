import type { ProfileText, ProjectText, SkillText, Translations } from "@/db/schema";
import type { ProjectImage } from "./images";
export type { ProfileText, ProjectImage, ProjectText, SkillText, Translations };

export type Experience = {
  role: string;
  company: string;
  period: string;
  points: string[];
};
export type Education = { degree: string; school: string; period: string };

export type Profile = {
  id: number;
  name: string;
  title: string;
  tagline: string;
  avatarUrl: string;
  avatarAlt: string;
  translations: Translations<ProfileText>;
  location: string;
  bio: string[];
  traits: string[];
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  telegramUrl: string;
  resumeUrl: string;
  resumeTags: string[];
  experience: Experience[];
  education: Education[];
  updatedAt: string;
};

export type Skill = {
  id: number;
  name: string;
  category: "frontend" | "tools" | "soft" | string;
  level: string;
  icon: string;
  sort: number;
  translations: Translations<SkillText>;
};

export type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  details: string;
  translations: Translations<ProjectText>;
  tags: string[];
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  images: ProjectImage[];
  accent: number;
  featured: boolean;
  sort: number;
  createdAt: string;
};

export type PublicMessage = {
  id: number;
  name: string;
  body: string;
  createdAt: string;
};

export type ModerationItem = PublicMessage & {
  email: string;
  status: "pending" | "approved" | "rejected";
  reviewedAt: string | null;
};

export const CATEGORY_LABELS: Record<string, string> = {
  frontend: "Frontend",
  tools: "Tools",
  soft: "Soft Skills",
};

export function levelTone(level: string): "gold" | "violet" | "neutral" {
  if (level === "Advanced") return "gold";
  if (level === "Intermediate") return "violet";
  return "neutral";
}

export function monogram(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
