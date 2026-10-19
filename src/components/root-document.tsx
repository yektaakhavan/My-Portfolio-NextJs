import type { ReactNode } from "react";
import { THEME_INIT_SCRIPT } from "@/components/theme-toggle";

/** The <html>/<body> shell shared by the public site (per language) and the admin area. */
export function RootDocument({ lang, dir, children }: { lang: string; dir: "ltr" | "rtl"; children: ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below sets data-theme before React hydrates
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>

      <body className="min-h-screen bg-canvas font-sans text-fg antialiased">
        {children}
      </body>
    </html>
  );
}
