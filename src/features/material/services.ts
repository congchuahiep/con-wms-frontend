"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { InferInput } from "valibot";
import { authApi } from "@/configs/api";
import { materialKeys, unitKeys } from "@/configs/querykeys";
import type { AppError } from "@/errors";
import type { Unit } from "@/features/unit";
import {
  type UsePartialUpdateOptions,
  usePartialUpdate,
} from "@/hooks/usePartialUpdate";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import type { Paginated } from "@/types";
import { MaterialSchema } from "./schemas";
import type { GetMaterialsParams, Material, MaterialDetail } from "./types";

/**
 * Lấy unit type của `unitId` từ React Query cache (đã được `useGetUnits()` populate).
 * Trả về undefined nếu chưa load được.
 */
function getUnitConversionType(
  queryClient: ReturnType<typeof useQueryClient>,
  unitId: number,
): Unit["conversionType"] | undefined {
  const units = queryClient.getQueryData<Unit[]>(unitKeys.list());
  return units?.find((u) => u.id === unitId)?.conversionType;
}

/**
 * Bỏ `conversions` khỏi payload khi unit không phải material-type.
 * Backend từ chối `conversions` với unit global.
 */
function stripConversionsIfGlobal<T extends object>(
  data: T,
  unitType: Unit["conversionType"] | undefined,
): Record<string, unknown> {
  if (unitType === "material") {
    return data as unknown as Record<string, unknown>;
  }

  const { conversions: _conversions, ...rest } = data as T & {
    conversions?: unknown;
  };
  return rest as Record<string, unknown>;
}

export function useGetMaterials(params: GetMaterialsParams = {}) {
  return useQuery<Paginated<Material>, AppError>({
    queryKey: materialKeys.filteredList(params),
    queryFn: async () => {
      const response = await authApi.get<Paginated<Material>>(
        (ep) => ep.materials.list,
        { params: params },
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useGetMaterial(id: number, options?: { enabled?: boolean }) {
  return useQuery<MaterialDetail, AppError>({
    ...options,
    queryKey: materialKeys.detail(id),
    queryFn: async () => {
      const response = await authApi.get<MaterialDetail>((ep) =>
        ep.materials.detail(id),
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
      conversions: [],
    },
    mutationFn: async (data) => {
      const unitType = getUnitConversionType(queryClient, data.unitId);
      const payload = stripConversionsIfGlobal(data, unitType);

      const response = await authApi.post<Material>(
        (ep) => ep.materials.create,
        payload,
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
  initialInput: Partial<InferInput<typeof MaterialSchema>>,
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
      const effectiveUnitId = data.unitId ?? initialInput.unitId ?? 0;
      const unitType = getUnitConversionType(queryClient, effectiveUnitId);
      const payload = stripConversionsIfGlobal(data, unitType);

      const response = await authApi.patch<Material>(
        (ep) => ep.materials.update(id as number),
        payload,
      );
      return response.data;
    },
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: materialKeys.list(),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: materialKeys.detail(data.id),
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
