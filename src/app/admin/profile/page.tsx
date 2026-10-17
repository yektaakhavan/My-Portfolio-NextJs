import type { Metadata } from "next";
import { getProfile } from "@/lib/data";
import ProfileClient from "./client";

export const metadata: Metadata = { title: "Profile" };
export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  return <ProfileClient initial={await getProfile()} />;
}
