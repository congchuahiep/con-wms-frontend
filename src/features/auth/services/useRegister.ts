"use client";

import { useMutation } from "@tanstack/react-query";
import { bffApi } from "@/configs/api";
import type { RegisterRequest } from "../types";

/**
 * Register — gọi qua BFF, BFF set httpOnly cookie.
 *
 * Dữ liệu camelCase được bffAxios request interceptor tự động
 * convert sang snake_case trước khi gửi.
 */
export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await bffApi.post<{
        user: unknown;
        message: string;
      }>((ep) => ep.auth.register, data);
      return response.data;
    },
  });
}
