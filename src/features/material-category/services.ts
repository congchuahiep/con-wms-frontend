"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/configs/api";
import { categoryKeys } from "@/configs/querykeys";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import { CreateCategorySchema } from "./schemas";
import type { MaterialCategory } from "./types";

export function useGetCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: async () => {
      const response = await authApi.get<MaterialCategory[]>(
        (ep) => ep.categories.list,
      );
      return response.data;
    },
  });
}

export function useAddCategory(
  options?: Omit<
    UsePostOptions<typeof CreateCategorySchema>,
    "schema" | "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return usePost({
    ...options,
    schema: CreateCategorySchema,
    initialInput: {
      code: "",
      name: "",
      description: "",
      color: null,
      parentId: null,
    },
    mutationFn: async (data) => {
      const response = await authApi.post<MaterialCategory>(
        (ep) => ep.categories.create,
        data,
      );
      return response.data;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
        exact: false,
      });
      options?.onSuccess?.(...args);
    },
  });
}
