"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InferOutput } from "valibot";
import { authApi } from "@/configs/api";
import { materialKeys } from "@/configs/querykeys";
import type { AppError } from "@/errors";
import {
  type UsePartialUpdateOptions,
  usePartialUpdate,
} from "@/hooks/usePartialUpdate";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import type { Paginated } from "@/types";
import { MaterialSchema } from "./schemas";
import type { Material } from "./types";

export interface GetMaterialsParams {
  search?: string;
  category?: number;
  page?: number;
  pageSize?: number;
}

export function useGetMaterials(params: GetMaterialsParams = {}) {
  return useQuery<Paginated<Material>, AppError>({
    queryKey: materialKeys.filteredList(params),
    queryFn: async () => {
      const response = await authApi.get<Paginated<Material>>(
        (ep) => ep.materials.list,
        { params },
      );
      return response.data;
    },
  });
}

export function useAddMaterial(
  options?: Omit<
    UsePostOptions<typeof MaterialSchema>,
    "schema" | "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return usePost({
    ...options,
    schema: MaterialSchema,
    initialInput: {
      code: "",
      name: "",
      categoryId: null,
      unitId: 0,
      description: "",
    },
    mutationFn: async (data) => {
      const response = await authApi.post<Material>(
        (ep) => ep.materials.create,
        data,
      );
      return response.data;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: materialKeys.list(),
        exact: false,
      });
      options?.onSuccess?.(...args);
    },
  });
}

export function useUpdateMaterial(
  id: number,
  initialInput: Partial<InferOutput<typeof MaterialSchema>>,
  options?: Omit<
    UsePartialUpdateOptions<typeof MaterialSchema, Material, AppError>,
    "schema" | "mutationFn" | "initialInput" | "id"
  >,
) {
  const queryClient = useQueryClient();

  return usePartialUpdate({
    ...options,
    schema: MaterialSchema,
    id,
    initialInput,
    mutationFn: async ({ id, ...data }) => {
      const response = await authApi.patch<Material>(
        (ep) => ep.materials.update(id as number),
        data,
      );
      return response.data;
    },
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: materialKeys.list(),
        exact: false,
      });
      options?.onSuccess?.(data, ...args);
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, number>({
    mutationFn: async (id) => {
      await authApi.delete((ep) => ep.materials.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: materialKeys.list(),
        exact: false,
      });
    },
  });
}
