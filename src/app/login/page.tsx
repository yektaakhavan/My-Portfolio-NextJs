import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/data";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Owner sign-in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/admin");
  const profile = await getProfile();
  const initials = (profile?.name ?? "Admin").split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
  return (
    <div className="starfield flex min-h-screen items-center justify-center px-4">
      <main id="main" className="fade-up w-full max-w-sm">
        <div className="mb-6 text-center">
          <span aria-hidden className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-surface-3 font-display text-2xl text-accent-300 ring-1 ring-accent-400/40">
            {initials}
          </span>
          <h1 className="mt-4 font-display text-2xl text-fg">Owner sign-in</h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage your portfolio content.</p>
        </div>
        <LoginForm />
      </main>
    </div>
  );
}
