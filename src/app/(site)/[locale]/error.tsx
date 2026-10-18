"use client";

import { Button } from "@/components/ui";
import { useI18n } from "@/i18n/provider";

export default function LocaleError({ reset }: { error: Error; reset: () => void }) {
  const { t } = useI18n();
  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-3xl text-fg">{t.error.title}</h1>
      <p className="mt-3 text-sm text-muted">{t.error.text}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={reset}>{t.error.retry}</Button>
        <Button href="/" variant="outline">{t.error.home}</Button>
      </div>
    </main>
  );
}
