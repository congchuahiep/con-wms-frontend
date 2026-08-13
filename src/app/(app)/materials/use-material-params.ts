"use client";

import { useState } from "react";
import type { GetMaterialsParams } from "@/features/material";

interface MaterialParamsState {
  params: GetMaterialsParams;
  setSearch: (search: string) => void;
  setCategory: (category: number | null) => void;
  setPage: (page: number) => void;
}

export function useMaterialParams(): MaterialParamsState {
  const [params, setParams] = useState<GetMaterialsParams>({
    search: "",
    category: undefined,
    page: 1,
    pageSize: 20,
  });

  const setSearch = (search: string) =>
    setParams((prev) => ({ ...prev, search, page: 1 }));

  const setCategory = (category: number | null) =>
    setParams((prev) => ({ ...prev, category: category ?? undefined, page: 1 }));

  const setPage = (page: number) => setParams((prev) => ({ ...prev, page }));

  return { params, setSearch, setCategory, setPage };
}
