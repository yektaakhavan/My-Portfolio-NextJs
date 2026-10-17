import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { publicMessages } from "@/db/schema";
import type { ModerationItem } from "@/lib/types";
import ModerationClient from "./client";

export const metadata: Metadata = { title: "Moderation" };
export const dynamic = "force-dynamic";

export default async function ModerationPage() {
  const rows = await db.select().from(publicMessages).orderBy(desc(publicMessages.createdAt)).limit(300);
  const items: ModerationItem[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    body: r.body,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    reviewedAt: r.reviewedAt?.toISOString() ?? null,
  }));
  return <ModerationClient initial={items} />;
}
