"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "@/i18n/provider";

/** next/link that keeps the visitor in the current language ("/about" → "/fa/about" on the Persian site). */
export function LocaleLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const { href: localize } = useI18n();
  return <Link href={localize(href)} {...props} />;
}
