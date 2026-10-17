/** Normalise user text: strip control characters, collapse huge whitespace, trim, cap length. */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim()
    .slice(0, max);
}

export function countLinks(text: string): number {
  return (text.match(/https?:\/\/|www\./gi) ?? []).length;
}

/** Only allow http(s) links (blocks javascript: / data: URLs in href attributes). */
export function safeHttpUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  const v = value.trim();
  if (!v) return "";
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : "";
  } catch {
    return "";
  }
}

/** Image URLs: https://..., or a path we serve ourselves (/uploads/..., /images/...). */
export function safeMediaUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  const v = value.trim();
  if (/^\/(uploads|images)\/[\w./-]+$/.test(v) && !v.includes("..")) return v;
  return safeHttpUrl(v);
}
