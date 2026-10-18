import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { DetailsEditor } from "./editor";

export const metadata: Metadata = { title: "Project write-up" };
export const dynamic = "force-dynamic";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n)) notFound();
  const [p] = await db
    .select({ id: projects.id, title: projects.title, slug: projects.slug, details: projects.details, translations: projects.translations })
    .from(projects)
    .where(eq(projects.id, n))
    .limit(1);
  if (!p) notFound();
  return <DetailsEditor project={{ id: p.id, title: p.title, slug: p.slug, details: p.details, faDetails: p.translations?.fa?.details ?? "" }} />;
}
