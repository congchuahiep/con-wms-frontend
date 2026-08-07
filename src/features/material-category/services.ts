"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/configs/api";
import { categoryKeys } from "@/configs/querykeys";
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
