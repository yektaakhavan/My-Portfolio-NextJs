import type { MetadataRoute } from "next";
import { getArticles, getProjects } from "@/lib/data";
import { LOCALES, withLocale } from "@/i18n/config";

export const revalidate = 3600;

/** Every page is listed once per language, with hreflang alternates so search engines connect the versions. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL ?? "http://localhost:3000";
  const projects = await getProjects().catch(() => []);
  const posts = await getArticles("en").catch(() => []);
  const paths = [
    "/", "/about", "/skills", "/projects", "/blog", "/messages", "/contact", "/resume", "/privacy", "/cookies", "/terms", "/accessibility",
    ...projects.map((p) => `/projects/${p.slug}`),
    ...posts.map((a) => `/blog/${a.slug}`),
  ];
  return paths.flatMap((path) =>
    LOCALES.map((l) => ({
      url: `${base}${withLocale(l, path)}`,
      alternates: { languages: Object.fromEntries(LOCALES.map((x) => [x, `${base}${withLocale(x, path)}`])) },
    })),
  );
}
