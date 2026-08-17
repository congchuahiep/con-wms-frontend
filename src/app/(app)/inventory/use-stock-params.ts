"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { GetStockParams } from "@/features/stock";

const SEARCH_DEBOUNCE_MS = 300;

interface StockParamsState {
  params: GetStockParams;
  /** Giá trị search tức thời (chưa debounce) — dùng làm value cho ô input. */
  search: string;
  setSearch: (search: string) => void;
  setWarehouse: (warehouse: number | null) => void;
  setCategory: (category: number | null) => void;
  setStockStatus: (status: "all" | "inStock") => void;
}

/**
 * State tập trung cho bộ lọc của trang Tồn kho.
 *
 * - `search` được debounce trước khi đưa vào `params` để mỗi phím gõ
 *   không tạo ra một query + re-render cả cây component.
 * - Các setter giữ identity ổn định bằng `useCallback` và `params` được
 *   memo hoá, tránh re-render lan truyền do prop thay đổi identity mỗi
 *   lần render.
 */
export function useStockParams(): StockParamsState {
  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [warehouse, setWarehouseState] = useState<number | null>(null);
  const [category, setCategoryState] = useState<number | null>(null);
  const [stockStatus, setStockStatusState] = useState<"all" | "inStock">("all");

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [search]);

  const setSearch = useCallback((next: string) => {
    setSearchState(next);
  }, []);

  const setWarehouse = useCallback((next: number | null) => {
    setWarehouseState(next);
  }, []);

  const setCategory = useCallback((next: number | null) => {
    setCategoryState(next);
  }, []);

  const setStockStatus = useCallback((next: "all" | "inStock") => {
    setStockStatusState(next);
  }, []);

  const params = useMemo<GetStockParams>(
    () => ({
      search: debouncedSearch || undefined,
      warehouse: warehouse ?? undefined,
      category: category ?? undefined,
      hasStock: stockStatus === "inStock" ? true : undefined,
    }),
    [debouncedSearch, warehouse, category, stockStatus],
  );

  return {
    params,
    search,
    setSearch,
    setWarehouse,
    setCategory,
    setStockStatus,
  };
}
