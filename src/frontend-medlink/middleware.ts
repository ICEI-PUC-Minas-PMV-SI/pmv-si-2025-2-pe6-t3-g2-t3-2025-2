import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function base64UrlDecode(base64Url: string) {
  // Convert from base64url to base64
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) base64 += '='.repeat(4 - pad);

  // Use atob when available (Edge/Browser runtime), fallback to Buffer for Node
  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(base64);
  }

  // Buffer exists in Node runtimes
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const buf = Buffer.from(base64, 'base64');
  return buf.toString('utf-8');
}

function parseJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/login", "/register", "/admin/login"];

  if (publicPaths.includes(pathname)) {
    if (pathname === "/admin/login" && token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = parseJwt(token);
  // If user object doesn't have an explicit `role` field check `authorities` array
  // (tokens may include roles as e.g. authorities: ['ROLE_ADMIN']).
  const hasRole = Boolean(user?.role) || Array.isArray(user?.authorities);
  if (!user || !hasRole) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && !(user.role === "ADMIN" || (Array.isArray(user.authorities) && user.authorities.includes('ROLE_ADMIN')))) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (pathname.startsWith("/paciente") && !(user.role === "PACIENTE" || (Array.isArray(user.authorities) && user.authorities.includes('ROLE_PACIENTE')))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin/login",
    "/paciente/:path*",
    "/login",
    "/register",
    "/",
  ],
};