import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profile } from "@/db/schema";
import { badRequest, getCurrentUser, unauthorized } from "@/lib/auth";
import { toProfile } from "@/lib/data";
import { adminGuard, revalidatePublic } from "@/lib/guard";
import { parseProfileTranslations } from "@/lib/admin-input";
import { safeHttpUrl, safeMediaUrl } from "@/lib/validators";

export const dynamic = "force-dynamic";

type ProfileRow = typeof profile.$inferSelect;

const DEFAULT_PROFILE: ProfileRow = {
  id: 1,
  name: "",
  title: "",
  tagline: "",
  avatarUrl: "",
  avatarAlt: "",
  translations: {},
  location: "",
  bio: [],
  traits: [],
  email: "",
  phone: "",
  githubUrl: "",
  linkedinUrl: "",
  telegramUrl: "",
  resumeUrl: "/resume",
  resumeTags: [],
  experience: [],
  education: [],
  updatedAt: new Date(),
};

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const [row] = await db.select().from(profile).limit(1);
  return Response.json({ profile: row ? toProfile(row) : null });
}

export async function PUT(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const [existing] = await db.select().from(profile).limit(1);
  const base = existing ?? DEFAULT_PROFILE;

  const s = (v: unknown, fb: string) => (typeof v === "string" ? v : fb);
  const arr = (v: unknown, fb: string[]) => (Array.isArray(v) ? (v as string[]) : fb);

  const payload = {
    name: s(body.name, base.name).trim(),
    title: s(body.title, base.title).trim(),
    tagline: s(body.tagline, base.tagline),
    avatarUrl: "avatarUrl" in body ? safeMediaUrl(body.avatarUrl) : base.avatarUrl,
    avatarAlt: s(body.avatarAlt, base.avatarAlt).trim().slice(0, 200),
    location: s(body.location, base.location),
    bio: arr(body.bio, base.bio),
    traits: arr(body.traits, base.traits),
    email: s(body.email, base.email),
    phone: s(body.phone, base.phone),
    githubUrl: "githubUrl" in body ? safeHttpUrl(body.githubUrl) : base.githubUrl,
    linkedinUrl: "linkedinUrl" in body ? safeHttpUrl(body.linkedinUrl) : base.linkedinUrl,
    telegramUrl: "telegramUrl" in body ? safeHttpUrl(body.telegramUrl) : base.telegramUrl,
    resumeUrl: s(body.resumeUrl, base.resumeUrl),
    resumeTags: arr(body.resumeTags, base.resumeTags),
    experience: Array.isArray(body.experience)
      ? (body.experience as ProfileRow["experience"])
      : base.experience,
    education: Array.isArray(body.education)
      ? (body.education as ProfileRow["education"])
      : base.education,
    translations: "translations" in body ? parseProfileTranslations(body.translations) : base.translations,
    updatedAt: new Date(),
  };

  if (!payload.name) return badRequest("Name is required.");
  if (!payload.title) return badRequest("Title is required.");

  if (!existing) {
    const [created] = await db.insert(profile).values({ ...payload, id: 1 }).returning();
    revalidatePublic();
    return Response.json({ profile: toProfile(created) });
  }
  const [updated] = await db
    .update(profile)
    .set(payload)
    .where(eq(profile.id, existing.id))
    .returning();
  revalidatePublic();
  return Response.json({ profile: toProfile(updated) });
}
