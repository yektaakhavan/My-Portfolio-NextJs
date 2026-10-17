import type { StoredImage } from "@/db/schema";
import { cleanText, safeMediaUrl } from "./validators";

/** Accepts ["a", "b"] and returns a clean, de-duplicated, length-capped list. */
export function strList(value: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const v of value) {
    const t = cleanText(v, maxLen);
    if (t && !out.includes(t)) out.push(t);
    if (out.length >= maxItems) break;
  }
  return out;
}

/** Accepts [{url, alt}] (or legacy plain URL strings); drops unsafe URLs. */
export function parseImages(value: unknown): StoredImage[] {
  if (!Array.isArray(value)) return [];
  const out: StoredImage[] = [];
  for (const v of value.slice(0, 20)) {
    const raw = typeof v === "string" ? { url: v, alt: "" } : (v as { url?: unknown; alt?: unknown });
    const url = safeMediaUrl(raw?.url);
    if (!url) continue;
    out.push({ url, alt: cleanText(raw?.alt, 200) });
  }
  return out;
}
