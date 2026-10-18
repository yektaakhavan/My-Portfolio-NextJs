import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import type { Locale } from "@/i18n/config";

/**
 * Translated versions of the content (the base columns hold the English text).
 * Only the languages you actually write appear here; anything left empty falls back to English.
 */
export type ProfileText = {
  name: string;
  title: string;
  tagline: string;
  location: string;
  bio: string[];
  traits: string[];
  experience: { role: string; company: string; period: string; points: string[] }[];
  education: { degree: string; school: string; period: string }[];
};
export type ProjectText = { title: string; description: string; details: string; tags: string[] };
export type SkillText = { name: string };
export type Translations<T> = Partial<Record<Locale, Partial<T>>>;

/** Images are stored either as a plain URL (legacy) or as { url, alt }. */
export type StoredImage = string | { url: string; alt: string };

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const profile = pgTable("profile", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  avatarAlt: text("avatar_alt").notNull().default(""),
  translations: jsonb("translations").$type<Translations<ProfileText>>().notNull().default({}),
  location: text("location").notNull().default(""),
  bio: jsonb("bio").$type<string[]>().notNull(),
  traits: jsonb("traits").$type<string[]>().notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  githubUrl: text("github_url").notNull().default(""),
  linkedinUrl: text("linkedin_url").notNull().default(""),
  telegramUrl: text("telegram_url").notNull().default(""),
  resumeUrl: text("resume_url").notNull().default("/resume"),
  resumeTags: jsonb("resume_tags").$type<string[]>().notNull(),
  experience: jsonb("experience")
    .$type<{ role: string; company: string; period: string; points: string[] }[]>()
    .notNull(),
  education: jsonb("education")
    .$type<{ degree: string; school: string; period: string }[]>()
    .notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // frontend | tools | soft
  level: text("level").notNull(), // Advanced | Intermediate | Beginner
  icon: text("icon").notNull().default("spark"),
  sort: integer("sort").notNull().default(0),
  translations: jsonb("translations").$type<Translations<SkillText>>().notNull().default({}),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  /** Optional long write-up (Markdown): what I learned, challenges, result… shown on the project page. */
  details: text("details").notNull().default(""),
  translations: jsonb("translations").$type<Translations<ProjectText>>().notNull().default({}),
  tags: jsonb("tags").$type<string[]>().notNull(),
  tech: jsonb("tech").$type<string[]>().notNull(),
  liveUrl: text("live_url").notNull().default(""),
  githubUrl: text("github_url").notNull().default(""),
  images: jsonb("images").$type<StoredImage[]>().notNull(),
  accent: integer("accent").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  sort: integer("sort").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  ipHash: text("ip_hash").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * Messages that visitors post on the public "Messages" page.
 * They stay "pending" (invisible to the public) until the owner approves them.
 */
export const publicMessages = pgTable(
  "public_messages",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().default(""), // private, never shown publicly
    body: text("body").notNull(),
    status: text("status").$type<"pending" | "approved" | "rejected">().notNull().default("pending"),
    ipHash: text("ip_hash").notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    reviewedAt: timestamp("reviewed_at"),
  },
  (t) => [
    index("public_messages_status_idx").on(t.status, t.createdAt),
    index("public_messages_ip_idx").on(t.ipHash, t.createdAt),
  ],
);
