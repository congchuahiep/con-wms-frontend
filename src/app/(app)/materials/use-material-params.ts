"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { GetMaterialsParams } from "@/features/material";

const SEARCH_DEBOUNCE_MS = 300;

interface MaterialParamsState {
  params: GetMaterialsParams;
  /** Giá trị search tức thời (chưa debounce) — dùng làm value cho ô input. */
  search: string;
  setSearch: (search: string) => void;
  setCategory: (category: number | null) => void;
  setPage: (page: number) => void;
}

/**
 * State tập trung cho bộ lọc + phân trang của trang Vật tư.
 *
 * - `search` được debounce trước khi đưa vào `params` để mỗi phím gõ
 *   không tạo ra một query + re-render cả cây component (đây là nguyên
 *   nhân chính khiến trang bị đơ khi gõ từ khoá).
 * - Các setter được giữ identity ổn định bằng `useCallback` và `params`
 *   được memo hoá, tránh re-render lan truyền do prop thay đổi identity
 *   mỗi lần render.
 */
export function useMaterialParams(): MaterialParamsState {
  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategoryState] = useState<number | null>(null);
  const [page, setPageState] = useState(1);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [search]);

  const setSearch = useCallback((next: string) => {
    setSearchState(next);
    setPageState(1);
  }, []);

  const setCategory = useCallback((next: number | null) => {
    setCategoryState(next);
    setPageState(1);
  }, []);

  const setPage = useCallback((next: number) => {
    setPageState(next);
  }, []);

  const params = useMemo<GetMaterialsParams>(
    () => ({
      search: debouncedSearch || undefined,
      category: category ?? undefined,
      page,
      pageSize: 20,
    }),
    [debouncedSearch, category, page],
  );

  return { params, search, setSearch, setCategory, setPage };
}
