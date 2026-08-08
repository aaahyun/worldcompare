import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // The bare domain root has no content of its own — it only ever redirects to a
  // locale path. next-intl issues that redirect as a 307, but for the unlinked
  // root URL that reads to crawlers as a temporary, session-dependent hop (it
  // also carries a Set-Cookie), which is a known cause of Bing's "discovered but
  // not crawled" state. It's actually permanent, so tell crawlers that with a 308.
  if (request.nextUrl.pathname === "/" && response.status === 307) {
    const location = response.headers.get("location");
    if (location) {
      return NextResponse.redirect(new URL(location, request.url), {
        status: 308,
        headers: response.headers,
      });
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|embed|_next|_vercel|.*\\..*).*)"],
};
