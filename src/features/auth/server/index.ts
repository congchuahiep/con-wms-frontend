"server-only";

import { cookies } from "next/headers";
import { ok, err, ResultAsync } from "neverthrow";
import axios from "axios";
import { cookieNames } from "@/configs/cookie";
import { env } from "@/configs/env";
import { internalEndpoints } from "@/configs/endpoints";
import { AppError, AuthError } from "@/errors";
import type { TokenPair } from "../types";

/**
 * Kết quả getValidToken:
 * - Ok: { access, refresh, isNew } — isNew=true nếu vừa mới refresh
 * - Err: AppError — không lấy được token hợp lệ
 */
export type ValidToken = {
  access: string;
  refresh: string;
  isNew: boolean;
};

/**
 * Đọc access/refresh token từ httpOnly cookie.
 * Nếu access hết hạn (không có) nhưng refresh còn → tự refresh với backend,
 * trả về token mới (isNew=true).
 *
 * Dùng trong:
 *   - /api/proxy/[...path]/route.ts   — để forward request authenticated
 *   - Server Components               — để fetch dữ liệu cần auth
 *
 * KHÔNG dùng ở client.
 */
export async function getValidToken() {
  const cookieStore = await cookies();
  const access = cookieStore.get(cookieNames.access)?.value;
  const refresh = cookieStore.get(cookieNames.refresh)?.value;

  // Có access token → trả về luôn (isNew=false)
  if (access) {
    return ok<ValidToken, AppError>({
      access,
      refresh: refresh ?? "",
      isNew: false,
    });
  }

  // Không có access, thử refresh
  if (!refresh) {
    return err<ValidToken, AppError>(new AuthError("Không tìm thấy token đăng nhập"));
  }

  // Gọi backend refresh endpoint trực tiếp (không qua internalApi)
  const refreshResult = await ResultAsync.fromPromise(
    axios.post<TokenPair>(`${env.API_URL}${internalEndpoints.auth.refresh}`, {
      refresh,
    }),
    (error) => new AuthError((error as Error).message),
  );

  if (refreshResult.isErr()) {
    return err<ValidToken, AppError>(new AuthError("Refresh token không hợp lệ"));
  }

  return ok<ValidToken, AppError>({
    access: refreshResult.value.data.access,
    refresh: refreshResult.value.data.refresh ?? refresh,
    isNew: true,
  });
}