"use client";

import { useEffect } from "react";

export function PrintTrigger({ autoPrint }: { autoPrint: boolean }) {
  useEffect(() => {
    if (!autoPrint) return;
    const t = window.setTimeout(() => window.print(), 600);
    return () => window.clearTimeout(t);
  }, [autoPrint]);
  return null;
}

/** Event handlers can't live in a server component, so the print button is its own client component. */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-[#6b4fbf] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#5a3fa8]"
    >
      {label}
    </button>
  );
}
