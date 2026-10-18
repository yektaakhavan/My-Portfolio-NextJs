"use client";

import { Button } from "@/components/ui";
import { useI18n } from "@/i18n/provider";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-xs font-bold tracking-widest text-accent-300 uppercase">{t.notFound.eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl text-fg">{t.notFound.title}</h1>
      <p className="mt-3 text-sm text-muted">{t.notFound.text}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button href="/" icon="arrow-right">{t.notFound.home}</Button>
        <Button href="/projects" variant="outline">{t.notFound.projects}</Button>
      </div>
    </div>
  );
}
