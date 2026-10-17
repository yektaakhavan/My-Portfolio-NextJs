import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/manrope";
import "@fontsource-variable/fraunces";
import { THEME_INIT_SCRIPT } from "@/components/theme-toggle";
import { ToastProvider } from "@/components/toast";
import { getProfile } from "@/lib/data";
import "./globals.css";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile().catch(() => null);
  const name = profile?.name ?? "Portfolio";
  const title = profile?.title ?? "Frontend Developer";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${name} — ${title}`, template: `%s — ${name}` },
    description:
      profile?.tagline ??
      "Portfolio of a frontend developer: projects, skills, resume and contact.",
    openGraph: { type: "website", siteName: name, title: `${name} — ${title}` },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#140d24" },
    { media: "(prefers-color-scheme: light)", color: "#faf7ff" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below sets data-theme before React hydrates
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-screen bg-canvas font-sans text-fg antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
