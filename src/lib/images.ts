import type { StoredImage } from "@/db/schema";

/** `auto` = no alt text was written, a generic one was generated (rebuilt per language). */
export type ProjectImage = { url: string; alt: string; auto?: boolean };

export function normalizeImages(list: StoredImage[] | null | undefined, fallbackAlt: string): ProjectImage[] {
  return (list ?? [])
    .map((img, i) => {
      if (typeof img === "string") return { url: img, alt: `${fallbackAlt} — screenshot ${i + 1}`, auto: true };
      const alt = img.alt?.trim();
      return alt ? { url: img.url, alt } : { url: img.url, alt: `${fallbackAlt} — screenshot ${i + 1}`, auto: true };
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
