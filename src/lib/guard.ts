import { revalidatePath } from "next/cache";
import { LOCALES } from "@/i18n/config";
import { getCurrentUser, unauthorized } from "./auth";

/** Rejects cross-site browser requests (extra layer on top of SameSite=Lax cookies). */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients (curl) and same-origin GETs
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Returns a Response when the request must be rejected, or null when it is allowed. */
export async function adminGuard(req: Request): Promise<Response | null> {
  if (!sameOrigin(req)) return Response.json({ error: "Cross-site request blocked." }, { status: 403 });
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  return null;
}

/** Public pages are cached (ISR); call after any admin change so visitors see it immediately. */
export function revalidatePublic() {
  // every language version of every public page (the default language is served from /en or /fa internally)
  for (const l of LOCALES) revalidatePath(`/${l}`, "layout");
}
