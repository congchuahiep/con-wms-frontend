/**
 * Tập trung API endpoints của backend Django.
 *
 * Backend Django yêu cầu URL kết thúc bằng `/`.
 *
 * Phân tách theo 3 loại instance:
 *   - bffEndpoints   : client gọi BFF Next.js (/api/*)
 *   - authEndpoints   : client gọi qua proxy (/api/proxy/*)
 *   - internalEndpoints: server-only gọi thẳng Django (env.API_URL)
 */

/** BFF Endpoints, Client → Next.js /api/* (không cần auth) */
export const bffEndpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
  },
} as const;

/**
 * Authenticated Endpoints, Client → /api/proxy/* (tự gửi httpOnly cookie)
 * Path sau /proxy/ phải khớp với Django URL (có slash cuối).
 * Tự thêm slash cuối trong proxy route handler.
 */
export const authEndpoints = {
  auth: {
    me: "/auth/me",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  warehouses: {
    list: "/warehouses/",
    create: "/warehouses/",
  },
  categories: {
    list: "/categories/",
    create: "/categories/",
  },
} as const;

/**
 * Internal Endpoints, Server-only, gọi trực tiếp Backend Django.
 *
 * Backend Django nên URL kết thúc bằng `/`.
 */
export const internalEndpoints = {
  auth: {
    login: "/auth/login/",
    register: "/auth/register/",
    refresh: "/auth/refresh/",
    logout: "/auth/logout/",
    me: "/auth/me/",
  },
} as const;
