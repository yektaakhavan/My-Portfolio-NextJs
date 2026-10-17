import type { StoredImage } from "@/db/schema";

export type ProjectImage = { url: string; alt: string };

export function normalizeImages(list: StoredImage[] | null | undefined, fallbackAlt: string): ProjectImage[] {
  return (list ?? [])
    .map((img, i) => {
      if (typeof img === "string") return { url: img, alt: `${fallbackAlt} — screenshot ${i + 1}` };
      return { url: img.url, alt: img.alt?.trim() || `${fallbackAlt} — screenshot ${i + 1}` };
    })
    .filter((img) => !!img.url);
}

/** Uploaded images exist in two sizes: name-1600.webp and name-640.webp. */
export function thumbUrl(url: string): string {
  return url.replace(/-1600\.webp$/, "-640.webp");
}
export function hasThumb(url: string): boolean {
  return /^\/uploads\/.+-1600\.webp$/.test(url);
}
