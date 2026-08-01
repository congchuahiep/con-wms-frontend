import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { handleAxiosError } from "@/utils/handlerAxiosError";
import { authEndpoints, bffEndpoints, internalEndpoints } from "./endpoints";
import { env } from "./env";

axios.defaults.paramsSerializer = { indexes: null };

// ============================================================
// 3 Axios Instances — BFF pattern
// ============================================================

/**
 * BFF Axios — Client-side
 *
 * Gọi Next.js BFF route (/api/auth/login, /api/auth/register, /api/auth/logout).
 *
 * KHÔNG gọi thẳng backend. Nhiệm vụ: gửi credentials lên BFF route handler,
 * BFF sẽ gọi thẳng backend, nhận token, set httpOnly cookie, trả về message.
 */
const bffAxios = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

/**
 * Auth Axios — Client-side
 *
 * Gọi Next.js proxy route (/api/proxy/*). Trình duyệt TỰ ĐỘNG gửi kèm
 * httpOnly cookie (vì sameSite=lax, same-origin Next.js).
 *
 * Proxy route handler (server-side) sẽ:
 *   1. Đọc access_token từ cookie
 *   2. Nếu hết hạn → refresh bằng refresh_token cookie
 *   3. Gắn Authorization header
 *   4. Forward request tới backend
 *
 * Client không bao giờ thấy token.
 */
const authAxios = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

/**
 * Internal Axios — Server-only
 *
 * Dùng trong Next.js route handler (BFF route + proxy route) để gọi
 * thẳng backend Django. KHÔNG dùng ở client.
 */
const internalAxios = axios.create({
  baseURL: env.API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Response interceptor chung cho cả 3 instance
for (const instance of [bffAxios, authAxios, internalAxios]) {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      throw handleAxiosError(error);
    },
  );
}

// ============================================================
// ApiClient — Axios instance + bound endpoints
// ============================================================

type EndpointFn<E> = (endpoints: E) => string;

interface ApiClient<E> {
  get<T = unknown>(
    endpointFn: EndpointFn<E>,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
  delete<T = unknown>(
    endpointFn: EndpointFn<E>,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
  post<T = unknown>(
    endpointFn: EndpointFn<E>,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
  put<T = unknown>(
    endpointFn: EndpointFn<E>,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
  patch<T = unknown>(
    endpointFn: EndpointFn<E>,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
  /** Raw axios instance — dùng cho edge cases cần truy cập trực tiếp */
  $axios: AxiosInstance;
}

function createApiClient<E>(
  instance: AxiosInstance,
  endpoints: E,
): ApiClient<E> {
  const resolve = (fn: EndpointFn<E>) => fn(endpoints);

  return {
    get: <T = unknown>(fn: EndpointFn<E>, config?: AxiosRequestConfig) =>
      instance.get<T>(resolve(fn), config),
    delete: <T = unknown>(fn: EndpointFn<E>, config?: AxiosRequestConfig) =>
      instance.delete<T>(resolve(fn), config),
    post: <T = unknown>(
      fn: EndpointFn<E>,
      data?: unknown,
      config?: AxiosRequestConfig,
    ) => instance.post<T>(resolve(fn), data, config),
    put: <T = unknown>(
      fn: EndpointFn<E>,
      data?: unknown,
      config?: AxiosRequestConfig,
    ) => instance.put<T>(resolve(fn), data, config),
    patch: <T = unknown>(
      fn: EndpointFn<E>,
      data?: unknown,
      config?: AxiosRequestConfig,
    ) => instance.patch<T>(resolve(fn), data, config),
    $axios: instance,
  };
}

// ============================================================
// Exported API Clients
// ============================================================

/**
 * BFF Public API — login, register, logout (không cần auth)
 *
 * @example
 * bffApi.post((ep) => ep.auth.login, { email, password })
 * bffApi.post((ep) => ep.auth.register, data)
 */
export const bffApi = createApiClient(bffAxios, bffEndpoints);

/**
 * Authenticated API — gọi qua proxy (tự gửi httpOnly cookie)
 *
 * @example
 * authApi.get((ep) => ep.auth.me)
 */
export const authApi = createApiClient(authAxios, authEndpoints);

/**
 * Internal API — server-only, gọi trực tiếp Backend
 *
 * @example
 * internalApi.post<TokenPair>((ep) => ep.auth.login, data)
 */
export const internalApi = createApiClient(internalAxios, internalEndpoints);