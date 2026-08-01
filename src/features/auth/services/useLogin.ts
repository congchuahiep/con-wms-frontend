"use client";

import { useMutation } from "@tanstack/react-query";
import { bffApi } from "@/configs/api";
import type { AppError } from "@/errors";

/**
 * Login — gọi qua BFF:
 *   client → /api/auth/login (Next route handler) → Django backend
 *
 * BFF route handler nhận { access, refresh } từ backend và set httpOnly cookie.
 * Client chỉ nhận { message }, KHÔNG thấy JWT.
 */
export function useLogin() {
  return useMutation<
    { message: string },
    AppError,
    { email: string; password: string }
  >({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await bffApi.post<{ message: string }>(
        (ep) => ep.auth.login,
        data,
      );
      return response.data;
    },
  });
}
