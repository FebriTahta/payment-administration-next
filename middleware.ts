import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateJWT } from "@/lib/jwt";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("authToken")?.value;

  const protectedPaths = [
    "/home-page",
    "/payment-list",
    "/payment-component-list",
    "/payment-detail",
    "/payment-option",
    "/insufficient-payment",
    "/new-payment",
    "/active-payment",
    "/status-payment",
    "/search-transaction",
  ];

  const loginPath = "/login-page";
  const homePath = "/home-page";
  const homeUrl = new URL(homePath, req.nextUrl.origin);
  const loginUrl = new URL(loginPath, req.nextUrl.origin);

  // Abaikan rute internal Next.js
  if (pathname.startsWith("/_next/") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // Redirect "/" ke "/home-page"
  if (pathname === "/") {
    return NextResponse.redirect(homeUrl.href);
  }

  // Izinkan akses ke halaman login
  if (pathname === loginPath) {
    return NextResponse.next();
  }

  // Redirect ke halaman login jika tidak ada token saat mengakses protectedPaths
  if (
    protectedPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    )
  ) {
    if (!token) {
      console.error("Token tidak ditemukan");
      return NextResponse.redirect(loginUrl.href);
    }

    try {
      const payload = await validateJWT(token);

      if (!payload) {
        console.error("Token invalid");
        return NextResponse.redirect(loginUrl.href);
      }

      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        console.error("Token sudah kadaluarsa");
        return NextResponse.redirect(loginUrl.href);
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Kesalahan validasi token:", error);
      return NextResponse.redirect(loginUrl.href);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home-page",
    "/login-page",
    "/payment-list",
    "/payment-component-list",
    "/payment-detail",
    "/payment-option",
    "/insufficient-payment",
    "/new-payment",
    "/active-payment",
    "/status-payment/:path*", 
    "/firebase-messaging-sw.js",
    "/search-transaction",
  ],
};
