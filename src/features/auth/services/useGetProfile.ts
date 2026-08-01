"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/configs/api";
import type { UserProfile } from "../types";
import { authKeys } from "./key";

/**
 * Lấy thông tin user hiện tại.
 *
 * Gọi qua proxy /api/proxy/* . Trình duyệt tự gửi httpOnly cookie, proxy
 * route handler sẽ attach vào Authorization header và forward tới backend.
 */
export function useGetProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await authApi.get<UserProfile>((ep) => ep.auth.me);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });
}