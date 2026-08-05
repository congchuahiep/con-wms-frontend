"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/configs/api";
import { warehouseKeys } from "@/configs/querykeys";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import { WarehouseSchema } from "./schemas";
import type { Warehouse } from "./types";

export function useGetWarehouses() {
  return useQuery({
    queryKey: warehouseKeys.list(),
    queryFn: async () => {
      const response = await authApi.get<Warehouse[]>(
        (ep) => ep.warehouses.list,
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
