import type { ReactNode } from "react";
import { THEME_INIT_SCRIPT } from "@/components/theme-toggle";

/** The <html>/<body> shell shared by the public site (per language) and the admin area. */
export function RootDocument({ lang, dir, children }: { lang: string; dir: "ltr" | "rtl"; children: ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below sets data-theme before React hydrates
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-screen bg-canvas font-sans text-fg antialiased">
        {children}
      </body>
    </html>
  );
}
