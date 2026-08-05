"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi, bffApi } from "@/configs/api";
import { authKeys } from "@/configs/querykeys";
import type { AppError } from "@/errors";
import type { RegisterRequest, UserProfile } from "./types";

export function useGetUserProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await authApi.get<UserProfile>((ep) => ep.auth.me);
      return response.data;
    },
  });
}

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
