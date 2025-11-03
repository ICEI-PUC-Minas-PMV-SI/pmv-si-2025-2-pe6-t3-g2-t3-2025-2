import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function parseJwt(token: string) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64').toString();
    return JSON.parse(payload);
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
  if (!user || !user.role) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (pathname.startsWith("/paciente") && user.role !== "PACIENTE") {
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