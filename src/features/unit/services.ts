"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InferOutput } from "valibot";
import { authApi } from "@/configs/api";
import { unitKeys } from "@/configs/querykeys";
import type { AppError } from "@/errors";
import {
  type UsePartialUpdateOptions,
  usePartialUpdate,
} from "@/hooks/usePartialUpdate";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import { UnitSchema } from "./schemas";
import type { DetailedUnit, Unit } from "./types";

export function useGetUnit(id: number, options?: { enabled?: boolean }) {
  return useQuery<DetailedUnit, AppError>({
    ...options,
    queryKey: unitKeys.detail(id),
    queryFn: async () => {
      const response = await authApi.get<DetailedUnit>((ep) =>
        ep.units.detail(id),
      );
      return response.data;
    },
  });
}

export function useGetUnits() {
  return useQuery<Unit[], AppError>({
    queryKey: unitKeys.list(),
    queryFn: async () => {
      const response = await authApi.get<Unit[]>((ep) => ep.units.list);
      return response.data;
    },
  });
}

export function useAddUnit(
  options?: Omit<UsePostOptions<typeof UnitSchema>, "schema" | "mutationFn">,
) {
  const queryClient = useQueryClient();

  return usePost({
    ...options,
    schema: UnitSchema,
    initialInput: { code: "", name: "", conversionType: "global" },
    mutationFn: async (data) => {
      const response = await authApi.post<Unit>((ep) => ep.units.create, data);
      return response.data;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: unitKeys.all, exact: false });
      options?.onSuccess?.(...args);
    },
  });
}

export function useUpdateUnit(
  id: number,
  initialInput: Partial<InferOutput<typeof UnitSchema>>,
  options?: Omit<
    UsePartialUpdateOptions<typeof UnitSchema, Unit, AppError>,
    "schema" | "mutationFn" | "initialInput" | "id"
  >,
) {
  return usePartialUpdate({
    ...options,
    schema: UnitSchema,
    id,
    initialInput,
    mutationFn: async ({ id, ...data }) => {
      const response = await authApi.patch<Unit>(
        (ep) => ep.units.update(id as number),
        data,
      );
      return response.data;
    },
    invalidateKeys: unitKeys.all,
  });
}

export function useDeleteUnit() {
  const queryClient = useQueryClient();

  return useMutation<Unit, AppError, number>({
    mutationFn: async (id) => {
      const response = await authApi.delete<Unit>((ep) => ep.units.delete(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.all, exact: false });
    },
  });
}
