"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/configs/api";
import { warehouseKeys } from "@/configs/querykeys";
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
