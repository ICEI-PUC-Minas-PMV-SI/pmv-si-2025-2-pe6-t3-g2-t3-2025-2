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

  // Permite rotas públicas
  if (publicPaths.includes(pathname)) {
    // Se for /admin/login e já tiver token, redireciona para /admin
    if (pathname === "/admin/login" && token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Se não tem token, bloqueia e redireciona para login correto
  if (!token) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Decodifica token para verificar role
  const user = parseJwt(token);
  if (!user || !user.role) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verifica role para rotas admin e paciente
  if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (pathname.startsWith("/paciente") && user.role !== "PACIENTE") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se passou nas validações, deixa passar
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