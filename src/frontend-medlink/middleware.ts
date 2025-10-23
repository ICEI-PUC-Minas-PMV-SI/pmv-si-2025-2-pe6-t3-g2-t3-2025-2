import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value

    const isProtecteRoute = 
        request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/scheduling") || 
        request.nextUrl.pathname.startsWith("/perfil") 


    if (isProtecteRoute && !token) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    }

    if (token && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
        return NextResponse.redirect(new URL("/scheduling", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/scheduling/:path*",
        "/perfil/:path*",
        "/login",
        "/register"
    ]
}