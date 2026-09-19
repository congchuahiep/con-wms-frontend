"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  GetStocktakeNotesParams,
  StocktakeNoteStatus,
} from "@/features/stocktake";

const SEARCH_DEBOUNCE_MS = 300;

interface StocktakeNoteParamsState {
  params: GetStocktakeNotesParams;
  search: string;
  setWarehouse: (warehouse?: number) => void;
  setDateFrom: (date?: string) => void;
  setDateTo: (date?: string) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
}

export function useStocktakeNoteParams(): StocktakeNoteParamsState {
  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [warehouse, setWarehouseState] = useState<number | undefined>();
  const [dateFrom, setDateFromState] = useState<string | undefined>(undefined);
  const [dateTo, setDateToState] = useState<string | undefined>(undefined);
  const [page, setPageState] = useState(1);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [search]);

  // Status sống trên URL (?status=...) — NoteStatusTabs ghi trực tiếp bằng router.push.
  const searchParams = useSearchParams();
  const statusRaw = searchParams.get("status");
  const status = (statusRaw as StocktakeNoteStatus | null) ?? "posted";

  // Chuyển status (URL đổi) → quay về trang 1 ngay trong lần render tiếp theo,
  // tránh gửi page cũ của status trước lên API.
  const prevStatusRef = useRef(statusRaw);
  if (prevStatusRef.current !== statusRaw) {
    prevStatusRef.current = statusRaw;
    setPageState(1);
  }

  const setSearch = useCallback((next: string) => {
    setSearchState(next);
    setPageState(1);
  }, []);

  const setWarehouse = useCallback((next: number | undefined) => {
    setWarehouseState(next);
    setPageState(1);
  }, []);

  const setDateFrom = useCallback((next: string | undefined) => {
    setDateFromState(next);
    setPageState(1);
  }, []);

  const setDateTo = useCallback((next: string | undefined) => {
    setDateToState(next);
    setPageState(1);
  }, []);

  const setPage = useCallback((next: number) => {
    setPageState(next);
  }, []);

  const params = useMemo<GetStocktakeNotesParams>(
    () => ({
      status: status ?? undefined,
      warehouse: warehouse ?? undefined,
      dateFrom: dateFrom ?? undefined,
      dateTo: dateTo ?? undefined,
      search: debouncedSearch || undefined,
      page,
      pageSize: 20,
    }),
    [status, warehouse, dateFrom, dateTo, debouncedSearch, page],
  );

  return {
    params,
    search,
    setWarehouse,
    setDateFrom,
    setDateTo,
    setSearch,
    setPage,
  };
}
