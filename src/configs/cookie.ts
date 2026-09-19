"server-only";

import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Cấu hình cookie httpOnly — chỉ server (Next.js route handler, Proxy,
 * Server Component) mới đọc/ghi được. JavaScript ở client KHÔNG đọc được.
 *
 * - httpOnly=true: chặn XSS đánh cắp token
 * - secure=true ở production (HTTPS), false ở dev (LAN HTTP)
 * - sameSite=lax: gửi kèm same-site navigation, chặn CSRF cross-site POST
 * - path=/: áp dụng cho toàn bộ app
 */
const commonCookieOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

export const cookieConfig = {
  access: {
    ...commonCookieOptions,
    // 8 giờ (khớp Django ACCESS_TOKEN_LIFETIME trong config/settings.py)
    maxAge: 60 * 60 * 8,
  },
  refresh: {
    ...commonCookieOptions,
    // 7 ngày (khớp Django REFRESH_TOKEN_LIFETIME)
    maxAge: 60 * 60 * 24 * 7,
  },
} as const;

/**
 * Tên cookie, dùng ở cả server (Next cookies API) và client (Proxy)
 */
export const cookieNames = {
  access: "access_token",
  refresh: "refresh_token",
} as const;
