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
  notes: {
    draftCount: "/draft-count/",
  },
  warehouses: {
    list: "/warehouses/",
    create: "/warehouses/",
    detail: (id: number) => `/warehouses/${id}/`,
    update: (id: number) => `/warehouses/${id}/`,
    delete: (id: number) => `/warehouses/${id}/`,
  },
  categories: {
    list: "/categories/",
    create: "/categories/",
    update: (id: number) => `/categories/${id}/`,
    delete: (id: number) => `/categories/${id}/`,
  },
  units: {
    list: "/units/",
    create: "/units/",
    detail: (id: number) => `/units/${id}/`,
    update: (id: number) => `/units/${id}/`,
    delete: (id: number) => `/units/${id}/`,
    conversions: (id: number) => `/units/${id}/conversions/`,
  },
  unitConversions: {
    update: (id: number) => `/unit-conversions/${id}/`,
    delete: (id: number) => `/unit-conversions/${id}/`,
  },
  materials: {
    list: "/materials/",
    create: "/materials/",
    detail: (id: number) => `/materials/${id}/`,
    update: (id: number) => `/materials/${id}/`,
    delete: (id: number) => `/materials/${id}/`,
  },
  suppliers: {
    list: "/suppliers/",
    create: "/suppliers/",
    detail: (id: number) => `/suppliers/${id}/`,
    update: (id: number) => `/suppliers/${id}/`,
    delete: (id: number) => `/suppliers/${id}/`,
  },
  stock: {
    balances: "/stock/",
    movements: "/stock/movements/",
  },
  inboundNotes: {
    list: "/inbound-notes/",
    create: "/inbound-notes/",
    detail: (id: number) => `/inbound-notes/${id}/`,
    update: (id: number) => `/inbound-notes/${id}/`,
    delete: (id: number) => `/inbound-notes/${id}/`,
    post: (id: number) => `/inbound-notes/${id}/post/`,
    void: (id: number) => `/inbound-notes/${id}/void/`,
  },
  sites: {
    list: "/sites/",
    create: "/sites/",
    detail: (id: number) => `/sites/${id}/`,
    update: (id: number) => `/sites/${id}/`,
    delete: (id: number) => `/sites/${id}/`,
    requirements: (id: number) => `/sites/${id}/requirements/`,
    settle: (id: number) => `/sites/${id}/settle/`,
  },
  outboundNotes: {
    list: "/outbound-notes/",
    create: "/outbound-notes/",
    detail: (id: number) => `/outbound-notes/${id}/`,
    update: (id: number) => `/outbound-notes/${id}/`,
    delete: (id: number) => `/outbound-notes/${id}/`,
    post: (id: number) => `/outbound-notes/${id}/post/`,
    void: (id: number) => `/outbound-notes/${id}/void/`,
  },
  stocktakeNotes: {
    list: "/stocktake-notes/",
    create: "/stocktake-notes/",
    detail: (id: number) => `/stocktake-notes/${id}/`,
    update: (id: number) => `/stocktake-notes/${id}/`,
    delete: (id: number) => `/stocktake-notes/${id}/`,
    post: (id: number) => `/stocktake-notes/${id}/post/`,
    void: (id: number) => `/stocktake-notes/${id}/void/`,
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
