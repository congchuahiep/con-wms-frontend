"use client";

import { useMutation } from "@tanstack/react-query";
import { bffApi } from "@/configs/api";

/**
 * Logout — gọi BFF, BFF sẽ:
 *   1. Gửi refresh lên backend để blacklist
 *   2. Xóa access + refresh cookie
 *
 * Client chỉ cần redirect sau khi OK, không cần lo token storage.
 */
export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const response = await bffApi.post<{ message: string }>(
        (ep) => ep.auth.logout,
      );
      return response.data;
    },
  });
}