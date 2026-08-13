"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InferInput } from "valibot";
import { authApi } from "@/configs/api";
import { supplierKeys } from "@/configs/querykeys";
import type { AppError } from "@/errors";
import {
  type UsePartialUpdateOptions,
  usePartialUpdate,
} from "@/hooks/usePartialUpdate";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import { SupplierSchema } from "./schemas";
import type { Supplier } from "./types";

export interface GetSuppliersParams {
  search?: string;
}

export function useGetSuppliers(params: GetSuppliersParams = {}) {
  return useQuery<Supplier[], AppError>({
    queryKey: supplierKeys.filteredList(params),
    queryFn: async () => {
      const response = await authApi.get<Supplier[]>(
        (ep) => ep.suppliers.list,
        { params },
      );
      return response.data;
    },
  });
}

export function useAddSupplier(
  options?: Omit<
    UsePostOptions<typeof SupplierSchema>,
    "schema" | "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return usePost({
    ...options,
    schema: SupplierSchema,
    initialInput: {
      code: "",
      name: "",
      taxCode: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      note: "",
    },
    mutationFn: async (data) => {
      const response = await authApi.post<Supplier>(
        (ep) => ep.suppliers.create,
        data,
      );
      return response.data;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: supplierKeys.all,
        exact: false,
      });
      options?.onSuccess?.(...args);
    },
  });
}

export function useUpdateSupplier(
  id: number,
  initialInput: Partial<InferInput<typeof SupplierSchema>>,
  options?: Omit<
    UsePartialUpdateOptions<typeof SupplierSchema, Supplier, AppError>,
    "schema" | "mutationFn" | "initialInput" | "id"
  >,
) {
  const queryClient = useQueryClient();

  return usePartialUpdate({
    ...options,
    schema: SupplierSchema,
    id,
    initialInput,
    mutationFn: async ({ id, ...data }) => {
      const response = await authApi.patch<Supplier>(
        (ep) => ep.suppliers.update(id as number),
        data,
      );
      return response.data;
    },
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: supplierKeys.all,
        exact: false,
      });
      options?.onSuccess?.(data, ...args);
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, number>({
    mutationFn: async (id) => {
      await authApi.delete((ep) => ep.suppliers.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: supplierKeys.all,
        exact: false,
      });
    },
  });
}
