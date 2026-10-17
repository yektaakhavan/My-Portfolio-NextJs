import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import ProjectsClient from "./client";

export const metadata: Metadata = { title: "Projects" };
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  return <ProjectsClient initial={await getProjects()} />;
}
