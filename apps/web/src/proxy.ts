import { COOKIE } from "@repo/types";
import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE_NAME = COOKIE.AUTHENTICATION;

const PROTECTED_PATHS = ["/projects", "/board", "/dashboard"] as const;
const AUTH_PATHS = ["/signin", "/signup"] as const;

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = request.cookies.has(ACCESS_COOKIE_NAME);

  if (isProtectedPath(pathname) && !hasAuthCookie) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthPath(pathname) && hasAuthCookie) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp)$).*)",
  ],
};
