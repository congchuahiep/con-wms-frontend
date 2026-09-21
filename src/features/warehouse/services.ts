"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/configs/api";
import { warehouseKeys } from "@/configs/querykeys";
import type { AppError } from "@/errors";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import { WarehouseSchema } from "./schemas";
import type { Warehouse } from "./types";

export function useGetWarehouses(options?: { includeSite?: boolean }) {
  const includeSite = options?.includeSite ?? false;
  return useQuery({
    // Tách key: danh sách mặc định (kho trung tâm) vs đầy đủ (kèm kho công trường)
    queryKey: [...warehouseKeys.list(), includeSite ? "all" : "central"],
    queryFn: async () => {
      const response = await authApi.get<Warehouse[]>(
        (ep) => ep.warehouses.list,
        { params: includeSite ? { include_site: "true" } : undefined },
      );
      return response.data;
    },
  });
}

export function useGetWarehouse(id: number, options?: { enabled?: boolean }) {
  return useQuery<Warehouse, AppError>({
    ...options,
    queryKey: warehouseKeys.detail(id),
    queryFn: async () => {
      const response = await authApi.get<Warehouse>(
        (ep) => ep.warehouses.detail(id),
        // Kho công trường không nằm trong scope mặc định của list —
        // detail phải yêu cầu include_site để không bị 404.
        { params: { include_site: "true" } },
      );
      return response.data;
    },
  });
}

export function useAddWarehouse(
  options?: Omit<
    UsePostOptions<typeof WarehouseSchema>,
    "schema" | "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return usePost({
    ...options,
    schema: WarehouseSchema,
    initialInput: {
      code: "",
      name: "",
      address: "",
      note: "",
      latitude: null,
      longitude: null,
    },
    mutationFn: async (data) => {
      const response = await authApi.post<Warehouse>(
        (ep) => ep.warehouses.create,
        data,
      );
      return response.data;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: warehouseKeys.all,
        exact: false,
      });

      options?.onSuccess?.(...args);
    },
  });
}
