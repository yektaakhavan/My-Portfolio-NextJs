import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";

/**
 * Language routing (Next.js 16 "proxy", formerly "middleware"):
 *   /about        → served from /{DEFAULT_LOCALE}/about  (URL stays /about)
 *   /fa/about     → served as is
 *   /en/about     → redirected to /about   (when "en" is the default; the default has no prefix)
 */
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (isLocale(first)) {
    if (first === DEFAULT_LOCALE) {
      const url = req.nextUrl.clone();
      url.pathname = pathname.slice(first.length + 1) || "/";
      url.search = search;
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // skip API, admin, sign-in, uploaded files, Next internals and anything with a file extension
  matcher: ["/((?!api|admin|login|uploads|_next|.*\\..*).*)"],
};
