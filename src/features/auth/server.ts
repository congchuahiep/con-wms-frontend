"server-only";

import axios from "axios";
import { err, ok, type Result, ResultAsync } from "neverthrow";
import { cookies } from "next/headers";
import { cookieNames } from "@/configs/cookie";
import { internalEndpoints } from "@/configs/endpoints";
import { env } from "@/configs/env";
import { type AppError, AuthError } from "@/errors";
import type { TokenPair } from "./types";

/**
 * Kết quả getValidToken:
 * - Ok: { access, refresh, isNew } — isNew=true nếu vừa mới refresh (rotation)
 * - Err: AppError — không lấy được token hợp lệ
 */
export type ValidToken = {
  access: string;
  refresh: string;
  isNew: boolean;
};

/** Refresh sớm khi access token còn dưới khoảng này (ms) trước khi hết hạn. */
const ACCESS_REFRESH_GRACE_MS = 60_000;

/**
 * Đọc access/refresh token từ httpOnly cookie. Nếu access thiếu hoặc JWT sắp
 * hết hạn → tự refresh với backend (rotation: backend trả access + refresh mới
 * và blacklist refresh cũ), trả về token mới (isNew=true).
 *
 * Các request đồng thời dùng cùng một refresh token chỉ gọi backend 1 lần
 * (single-flight) — với BLACKLIST_AFTER_ROTATION, refresh song song sẽ khiến
 * refresh token cũ bị blacklist và các request còn lại thất bại.
 *
 * Dùng trong:
 *   - /api/proxy/[...path]/route.ts — để forward request authenticated
 *   - Server Components             — để fetch dữ liệu cần auth
 *
 * KHÔNG dùng ở client.
 */
export async function getValidToken() {
  const cookieStore = await cookies();
  const access = cookieStore.get(cookieNames.access)?.value;
  const refresh = cookieStore.get(cookieNames.refresh)?.value;

  // Có access cookie và JWT còn hạn dùng → trả về luôn (isNew=false)
  if (access && isAccessUsable(access)) {
    return ok<ValidToken, AppError>({
      access,
      refresh: refresh ?? "",
      isNew: false,
    });
  }

  // Không có access dùng được (thiếu/hết hạn) nhưng có refresh → refresh
  if (!refresh) {
    return err<ValidToken, AppError>(
      new AuthError("Không tìm thấy token đăng nhập"),
    );
  }

  return refreshAccessToken(refresh);
}

/** Refresh đang chạy dở theo từng refresh token — tránh refresh song song. */
let pendingRefresh: {
  token: string;
  promise: Promise<Result<ValidToken, AppError>>;
} | null = null;

function refreshAccessToken(
  refresh: string,
): Promise<Result<ValidToken, AppError>> {
  if (pendingRefresh?.token === refresh) return pendingRefresh.promise;

  const promise = doRefresh(refresh).finally(() => {
    if (pendingRefresh?.token === refresh) pendingRefresh = null;
  });
  pendingRefresh = { token: refresh, promise };

  return promise;
}

/** Gọi POST <backend>/auth/refresh/ — backend rotate và blacklist refresh cũ. */
async function doRefresh(
  refresh: string,
): Promise<Result<ValidToken, AppError>> {
  const refreshResult = await ResultAsync.fromPromise(
    axios.post<TokenPair>(`${env.API_URL}${internalEndpoints.auth.refresh}`, {
      refresh,
    }),
    (error) => new AuthError((error as Error).message),
  );

  if (refreshResult.isErr()) {
    // Refresh token đã bị blacklist (vd dùng lại token cũ) hoặc hết hạn
    return err<ValidToken, AppError>(
      new AuthError("Refresh token không hợp lệ"),
    );
  }

  return ok<ValidToken, AppError>({
    access: refreshResult.value.data.access,
    // Backend bật ROTATE_REFRESH_TOKENS → trả refresh mới; fallback giữ refresh cũ
    refresh: refreshResult.value.data.refresh ?? refresh,
    isNew: true,
  });
}

/**
 * Decode JWT payload (KHÔNG verify chữ ký — chỉ đọc exp) để biết access token
 * còn dùng được không. Trả false khi không parse được → coi như cần refresh.
 */
function isAccessUsable(access: string): boolean {
  try {
    const payload = access.split(".")[1];
    if (!payload) return false;
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { exp?: unknown };
    if (typeof data.exp !== "number") return false;
    return data.exp * 1000 > Date.now() + ACCESS_REFRESH_GRACE_MS;
  } catch {
    return false;
  }
}
