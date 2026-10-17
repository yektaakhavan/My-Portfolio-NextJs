import type { ReactNode } from "react";

/** Every page has exactly one <h1>. */
export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="space-y-3 text-center">
      <p className="text-xs font-bold tracking-widest text-accent-300 uppercase">{eyebrow}</p>
      <h1 className="font-display text-4xl text-fg sm:text-5xl">{title}</h1>
      {children ? <div className="mx-auto max-w-xl text-sm text-muted">{children}</div> : null}
    </div>
  );
}
