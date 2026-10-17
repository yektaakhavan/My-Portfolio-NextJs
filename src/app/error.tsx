"use client";

import { Button } from "@/components/ui";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-3xl text-fg">Something went wrong</h1>
      <p className="mt-3 text-sm text-muted">An unexpected error occurred. Please try again.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="outline">Back to home</Button>
      </div>
    </main>
  );
}
