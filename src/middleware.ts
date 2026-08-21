import { NextResponse, type NextRequest } from "next/server";

import { ROUTES } from "@/lib/routes";

const SESSION_COOKIE = "connect.sid";

/**
 * First-pass guard for the admin area so the dashboard shell is never delivered
 * to an anonymous visitor.
 *
 * This only checks that a session cookie is *present*. It cannot check validity:
 * the cookie is signed with the API's SESSION_SECRET and the session itself lives
 * in the API's database. An expired or forged cookie passes here and is then
 * rejected by AdminAuthGate, which is the authoritative check.
 */
export function middleware(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  return NextResponse.redirect(new URL(ROUTES.admin.login, request.url));
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
