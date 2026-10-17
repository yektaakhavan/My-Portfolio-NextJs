import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL ?? "http://localhost:3000";
  const projects = await getProjects().catch(() => []);
  const pages = ["", "/about", "/skills", "/projects", "/messages", "/contact", "/resume", "/privacy", "/cookies", "/terms", "/accessibility"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}` })),
  ];
}
