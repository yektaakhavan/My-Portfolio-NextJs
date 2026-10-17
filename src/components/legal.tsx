import type { ReactNode } from "react";

export function LegalPage({ title, updated, intro, children }: { title: string; updated: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-10 space-y-3 border-b border-line pb-8">
        <p className="text-xs font-bold tracking-widest text-accent-300 uppercase">Legal</p>
        <h1 className="font-display text-4xl text-fg sm:text-5xl">{title}</h1>
        <p className="text-sm text-muted">
          Last updated: <time dateTime={updated}>{new Date(updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
        </p>
        {intro ? <div className="pt-2 text-base leading-relaxed text-muted">{intro}</div> : null}
      </header>
      <div className="space-y-10">{children}</div>
    </article>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 text-sm leading-relaxed text-muted sm:text-base">
      <h2 className="font-display text-2xl text-fg">{title}</h2>
      {children}
    </section>
  );
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-5 marker:text-accent-300">{children}</ul>;
}

export const legalLink = "font-semibold text-accent-300 underline underline-offset-2 hover:text-fg";
