import { type NextRequest, NextResponse } from "next/server";
import { cookieNames } from "@/configs/cookie";

/**
 * Next.js 16 Proxy (tên cũ: Middleware) — chạy trên server trước mọi request.
 *
 * Nhiệm vụ duy nhất: kiểm tra sự tồn tại của access_token cookie
 * trên các protected routes. Đây là "optimistic check" — chỉ đọc cookie,
 * KHÔNG verify token với backend (Next.js docs khuyến nghị).
 *
 * Verify thật sự diễn ra ở backend khi mỗi API call kèm cookie.
 *
 * Quy ước route:
 * - Public (không cần check): /login, /api/* (BFF + proxy), static assets
 * - Protected (cần access_token): tất cả routes khác
 */

const publicPaths = ["/login", "/register", "/forgot-password"];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((p) => pathname.startsWith(p));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Đã có access token mà vào /login → redirect về /
  if (isPublicPath(pathname)) {
    const hasAccess = request.cookies.get(cookieNames.access);
    if (hasAccess && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protected route: cần access_token
  const accessToken = request.cookies.get(cookieNames.access)?.value;

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Bỏ qua: API routes, static files, images
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)",
  ],
};
