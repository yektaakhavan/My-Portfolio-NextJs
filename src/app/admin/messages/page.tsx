import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import MessagesClient from "./client";

export const metadata: Metadata = { title: "Inbox" };
export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const rows = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(500);
  return <MessagesClient initial={rows.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))} />;
}
