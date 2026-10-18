"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, Card, Field, Input } from "@/components/ui";
import { api } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api("/api/auth/login", { method: "POST", json: { email, password } });
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setBusy(false);
      emailRef.current?.focus();
    }
  }

  return (
    <Card className="p-6 shadow-2xl">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/50 bg-danger/10 px-3 py-2.5 text-sm text-danger">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        <Field label="Email address" required>
          <Input ref={emailRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </Field>
        <Field label="Password" required>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </Field>
        <Button type="submit" loading={busy} size="lg" className="w-full">
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <Link href="/" className="text-sm font-semibold text-muted hover:text-accent-300">
          <span aria-hidden>←</span> Back to website
        </Link>
        <ThemeToggle />
      </div>
    </Card>
  );
}
