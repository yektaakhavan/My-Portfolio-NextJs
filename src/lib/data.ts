import "server-only";
import { cache } from "react";
import { and, asc, count, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { messages, profile, projects, publicMessages, skills } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import { normalizeImages } from "./images";
import { localizeProfile, localizeProject, localizeSkill } from "./localize";
import type { Profile, Project, PublicMessage, Skill } from "./types";

type ProjectRow = typeof projects.$inferSelect;
type ProfileRow = typeof profile.$inferSelect;

export function toProject(row: ProjectRow): Project {
  return {
    ...row,
    images: normalizeImages(row.images, row.title),
    createdAt: row.createdAt.toISOString(),
  };
}

export function toProfile(row: ProfileRow): Profile {
  return { ...row, updatedAt: row.updatedAt.toISOString() };
}

/** React cache(): header, footer and page all call this; the DB is hit once per request. */
const getProfileRaw = cache(async (): Promise<Profile | null> => {
  const [row] = await db.select().from(profile).limit(1);
  return row ? toProfile(row) : null;
});

/** `locale` picks the language of bio / title / experience… (falls back to English where not translated). */
export const getProfile = cache(async (locale: Locale = "en"): Promise<Profile | null> => {
  const p = await getProfileRaw();
  return p ? localizeProfile(p, locale) : null;
});

const getSkillsRaw = cache(async (): Promise<Skill[]> => {
  return db.select().from(skills).orderBy(asc(skills.sort), asc(skills.id));
});

export const getSkills = cache(async (locale: Locale = "en"): Promise<Skill[]> => {
  const all = await getSkillsRaw();
  return all.map((x) => localizeSkill(x, locale));
});

const getProjectsRaw = cache(async (): Promise<Project[]> => {
  const rows = await db.select().from(projects).orderBy(asc(projects.sort), asc(projects.id));
  return rows.map(toProject);
});

export const getProjects = cache(async (locale: Locale = "en"): Promise<Project[]> => {
  const all = await getProjectsRaw();
  return all.map((x) => localizeProject(x, locale));
});

export const getProjectBySlug = cache(async (slug: string, locale: Locale = "en"): Promise<Project | null> => {
  const [row] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return row ? localizeProject(toProject(row), locale) : null;
});

export const getRelatedProjects = cache(async (slug: string, locale: Locale = "en"): Promise<Project[]> => {
  const rows = await db
    .select()
    .from(projects)
    .where(and(ne(projects.slug, slug), eq(projects.featured, true)))
    .orderBy(asc(projects.sort))
    .limit(2);
  return rows.map((r) => localizeProject(toProject(r), locale));
});

/** Only APPROVED messages ever reach the public site. */
export const getApprovedMessages = cache(async (limit = 50): Promise<PublicMessage[]> => {
  const rows = await db
    .select({
      id: publicMessages.id,
      name: publicMessages.name,
      body: publicMessages.body,
      createdAt: publicMessages.createdAt,
    })
    .from(publicMessages)
    .where(eq(publicMessages.status, "approved"))
    .orderBy(desc(publicMessages.createdAt))
    .limit(limit);
  return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
});

export async function getAdminOverview() {
  const [projectCount, skillCount, msgTotal, msgUnread, pending] = await Promise.all([
    db.select({ n: count() }).from(projects),
    db.select({ n: count() }).from(skills),
    db.select({ n: count() }).from(messages),
    db.select({ n: count() }).from(messages).where(eq(messages.read, false)),
    db.select({ n: count() }).from(publicMessages).where(eq(publicMessages.status, "pending")),
  ]);
  const [recentMessages, recentProjects] = await Promise.all([
    db
      .select({
        id: messages.id,
        name: messages.name,
        body: messages.body,
        read: messages.read,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .orderBy(desc(messages.createdAt))
      .limit(5),
    db
      .select({ id: projects.id, title: projects.title, featured: projects.featured })
      .from(projects)
      .orderBy(asc(projects.sort))
      .limit(4),
  ]);
  return {
    stats: {
      projects: projectCount[0].n,
      skills: skillCount[0].n,
      messages: msgTotal[0].n,
      unread: msgUnread[0].n,
      pendingPublic: pending[0].n,
    },
    recentMessages: recentMessages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })),
    recentProjects,
  };
}

export async function getPendingCount(): Promise<number> {
  const [row] = await db
    .select({ n: count() })
    .from(publicMessages)
    .where(eq(publicMessages.status, "pending"));
  return row.n;
}
