"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { InferOutput } from "valibot";
import { authApi } from "@/configs/api";
import { categoryKeys } from "@/configs/querykeys";
import type { AppError } from "@/errors";
import {
  type UsePartialUpdateOptions,
  usePartialUpdate,
} from "@/hooks/usePartialUpdate";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import { CategorySchema } from "./schemas";
import type { MaterialCategory } from "./types";

export function useGetCategories() {
  return useQuery<MaterialCategory[], AppError>({
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
    UsePostOptions<typeof CategorySchema>,
    "schema" | "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return usePost({
    ...options,
    schema: CategorySchema,
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

export function useUpdateCategory(
  id: number,
  initialInput: Partial<InferOutput<typeof CategorySchema>>,
  options?: Omit<
    UsePartialUpdateOptions<typeof CategorySchema, MaterialCategory, AppError>,
    "schema" | "mutationFn" | "initialInput" | "id"
  >,
) {
  return usePartialUpdate({
    ...options,
    schema: CategorySchema,
    id: id,
    initialInput: initialInput,
    mutationFn: async ({ id, ...data }) => {
      const response = await authApi.patch<MaterialCategory>(
        (ep) => ep.categories.update(id as number),
        data,
      );
      return response.data;
    },
    invalidateKeys: categoryKeys.all,
  });
}
