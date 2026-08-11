"use client";

import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { InferInput } from "valibot";
import { authApi } from "@/configs/api";
import { unitKeys } from "@/configs/querykeys";
import type { AppError } from "@/errors";
import {
  type UsePartialUpdateOptions,
  usePartialUpdate,
} from "@/hooks/usePartialUpdate";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import type { DetailedUnit } from "../unit/types";
import { ConversionSchema } from "./schemas";
import type { UnitConversion } from "./types";

export function useAddConversion(
  unitId: number,
  options?: Omit<
    UsePostOptions<typeof ConversionSchema, UnitConversion, AppError>,
    "schema" | "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return usePost({
    ...options,
    schema: ConversionSchema,
    initialInput: { toUnitId: null, factor: "1" },
    mutationFn: async (data) => {
      const response = await authApi.post<UnitConversion>(
        (ep) => ep.units.conversions(unitId),
        data,
      );
      return response.data;
    },

    onSuccess: (data, ...args) => {
      queryClient.setQueryData<DetailedUnit>(
        unitKeys.detail(data.fromUnit.id),
        (old) => {
          if (old) {
            return {
              ...old,
              conversions: old.conversions.map((oldConversion) =>
                oldConversion.id === data.id ? data : oldConversion,
              ),
            };
          }

          return old;
        },
      );

      queryClient.setQueryData<DetailedUnit>(
        unitKeys.detail(data.toUnit.id),
        (old) => {
          if (old) {
            return {
              ...old,
              conversions: old.conversions.map((oldConversion) =>
                oldConversion.id === data.id
                  ? {
                      ...data,
                      factor: String(1.0 / Number(data.factor)),
                      isReverse: true,
                    }
                  : oldConversion,
              ),
            };
          }

          return old;
        },
      );

      options?.onSuccess?.(data, ...args);
    },
    onSettled: (data, ...args) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: unitKeys.detail(data.fromUnit.id),
        });
        queryClient.invalidateQueries({
          queryKey: unitKeys.detail(data.toUnit.id),
        });
      }

      options?.onSettled?.(data, ...args);
    },
  });
}

export function useUpdateConversion(
  id: number,
  isReverse: boolean,
  initialInput: Partial<InferInput<typeof ConversionSchema>>,
  options?: Omit<
    UsePartialUpdateOptions<typeof ConversionSchema, UnitConversion, AppError>,
    "schema" | "mutationFn" | "initialInput" | "id"
  >,
) {
  const queryClient = useQueryClient();

  return usePartialUpdate({
    ...options,
    schema: ConversionSchema,
    id,
    initialInput,
    mutationFn: async ({ id, factor }) => {
      const forwardFactor = factor
        ? isReverse
          ? 1 / factor
          : factor
        : undefined;

      const response = await authApi.patch<UnitConversion>(
        (ep) => ep.unitConversions.update(id as number),
        { factor: forwardFactor },
      );
      return response.data;
    },

    onSuccess: (data, ...args) => {
      queryClient.setQueryData<DetailedUnit>(
        unitKeys.detail(data.fromUnit.id),
        (old) => {
          if (old) {
            return {
              ...old,
              conversions: old.conversions.map((oldConversion) =>
                oldConversion.id === data.id ? data : oldConversion,
              ),
            };
          }

          return old;
        },
      );

      queryClient.setQueryData<DetailedUnit>(
        unitKeys.detail(data.toUnit.id),
        (old) => {
          if (old) {
            return {
              ...old,
              conversions: old.conversions.map((oldConversion) =>
                oldConversion.id === data.id
                  ? {
                      ...data,
                      factor: String(1.0 / Number(data.factor)),
                      isReverse: true,
                    }
                  : oldConversion,
              ),
            };
          }

          return old;
        },
      );

      options?.onSuccess?.(data, ...args);
    },
    onSettled: (data, ...args) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: unitKeys.detail(data.fromUnit.id),
        });
        queryClient.invalidateQueries({
          queryKey: unitKeys.detail(data.toUnit.id),
        });
      }

      options?.onSettled?.(data, ...args);
    },
  });
}

export function useDeleteConversion(
  options?: UseMutationOptions<UnitConversion, AppError, number>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async (id) => {
      const response = await authApi.delete<UnitConversion>((ep) =>
        ep.unitConversions.delete(id),
      );

      return response.data;
    },
    onSuccess: (deleteUnitConversion, ...args) => {
      queryClient.setQueryData<DetailedUnit>(
        unitKeys.detail(deleteUnitConversion.fromUnit.id),
        (old) => {
          if (old) {
            return {
              ...old,
              conversions: old.conversions.filter(
                (oldConversion) => oldConversion.id !== deleteUnitConversion.id,
              ),
            };
          }

          return old;
        },
      );

      queryClient.setQueryData<DetailedUnit>(
        unitKeys.detail(deleteUnitConversion.toUnit.id),
        (old) => {
          if (old) {
            return {
              ...old,
              conversions: old.conversions.filter(
                (oldConversion) => oldConversion.id !== deleteUnitConversion.id,
              ),
            };
          }

          return old;
        },
      );

      options?.onSuccess?.(deleteUnitConversion, ...args);
    },

    onSettled: (deleteUnitConversion, ...args) => {
      if (deleteUnitConversion) {
        queryClient.invalidateQueries({
          queryKey: unitKeys.detail(deleteUnitConversion.fromUnit.id),
        });
        queryClient.invalidateQueries({
          queryKey: unitKeys.detail(deleteUnitConversion.toUnit.id),
        });
      }

      options?.onSettled?.(deleteUnitConversion, ...args);
    },
  });
}
