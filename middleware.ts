import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REDIRECTS: Record<string, string> = {
  "/recovery": "/",
  "/marketing/vision": "/",
  "/marketing": "/",
  "/legal": "/legal/privacy",
  "/pricing": "/",
  "/privacy": "/legal/privacy",
  "/terms": "/legal/terms",
  "/contact": "/",
  "/buy": "/",
  "/extract": "/",
  "/diagnostic": "/",
  "/intake": "/",
  "/textback": "/",
  "/partners": "/",
  "/referral": "/",
  "/revenue-calculator": "/",
  "/ghost-work-receipt": "/",
  "/restaurant": "/",
  "/salon": "/",
  "/real-estate": "/",
  "/contractors": "/",
  "/chiro": "/",
  "/childcare": "/",
  "/medspa": "/",
  "/ecommerce": "/",
  "/dental": "/",
  "/missed-lead-follow-up": "/",
  "/fitness": "/",
  "/cleaning": "/",
  "/auto-shop": "/",
  "/local-business-automation": "/",
  "/law-firms": "/",
  "/accounting": "/",
  "/agency": "/",
  "/ai-agents-for-small-business": "/",
  "/ai-receptionist-small-business": "/",
  "/website-and-automation": "/",
  "/os": "/",
  "/signin": "/",
  "/onboard": "/",
  "/talent": "/",
  "/investor": "/",
  "/client": "/",
  "/report": "/",
  "/run": "/",
  "/share": "/",
  "/testimonial": "/",
};

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const retiredPrefix = [
    "/diagnostic/",
    "/marketing/",
    "/os/",
    "/onboard/",
    "/signin/",
    "/client/",
    "/report/",
    "/run/",
    "/share/",
    "/testimonial/",
    "/talent/",
    "/investor/",
  ];
  const destination =
    REDIRECTS[pathname] || (retiredPrefix.some((prefix) => pathname.startsWith(prefix)) ? "/" : undefined);
  if (!destination) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = destination;
  url.hash = "";
  url.search = "";
  return NextResponse.redirect(url, { status: 301 });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)", "/investor/:path*"],
};
