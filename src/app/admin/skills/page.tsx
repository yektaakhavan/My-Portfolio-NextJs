import type { Metadata } from "next";
import { getSkills } from "@/lib/data";
import SkillsClient from "./client";

export const metadata: Metadata = { title: "Skills" };
export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  return <SkillsClient initial={await getSkills()} />;
}
