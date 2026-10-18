import type { Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/manrope";
import "@fontsource-variable/fraunces";
import { RootDocument } from "@/components/root-document";
import { ToastProvider } from "@/components/toast";
import "@/app/globals.css";

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#140d24" },
    { media: "(prefers-color-scheme: light)", color: "#faf7ff" },
  ],
};

/** Admin area and owner sign-in: always English, left-to-right. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument lang="en" dir="ltr">
      <ToastProvider>{children}</ToastProvider>
    </RootDocument>
  );
}
