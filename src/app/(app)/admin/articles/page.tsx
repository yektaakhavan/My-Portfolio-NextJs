import type { Metadata } from "next";
import { getArticles } from "@/lib/data";
import ArticlesClient from "./client";

export const metadata: Metadata = { title: "Articles" };
export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  return <ArticlesClient initial={await getArticles()} />;
}
