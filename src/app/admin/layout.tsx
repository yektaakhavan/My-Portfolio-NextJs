import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { getCurrentUser } from "@/lib/auth";
import { getPendingCount } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { default: "Admin", template: "%s — Admin" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const pending = await getPendingCount();
  return (
    <AdminShell user={user} pending={pending}>
      {children}
    </AdminShell>
  );
}
