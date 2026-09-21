"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import type {
  GetStocktakeNotesParams,
  StocktakeNoteStatus,
} from "@/features/stocktake";
import { useUrlSearchParam } from "@/hooks/use-url-search-param";

interface StocktakeNoteParamsState {
  params: GetStocktakeNotesParams;
  /** Giá trị search tức thời (chưa debounce) — dùng làm value cho ô input. */
  search: string;
  setWarehouse: (warehouse?: number) => void;
  setDateFrom: (date?: string) => void;
  setDateTo: (date?: string) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
}

/**
 * State tập trung cho bộ lọc + phân trang của trang Phiếu kiểm kê.
 *
 * - `search` sống trên URL (`?search=...`) — debounce 300ms rồi commit bằng
 *   `router.replace` (hook `useUrlSearchParam`). Link ngoài lọc sẵn bằng mã.
 */
export function useStocktakeNoteParams(): StocktakeNoteParamsState {
  const {
    value: urlSearch,
    inputValue: search,
    setInputValue: setSearch,
  } = useUrlSearchParam("search");
  const [warehouse, setWarehouseState] = useState<number | undefined>();
  const [dateFrom, setDateFromState] = useState<string | undefined>(undefined);
  const [dateTo, setDateToState] = useState<string | undefined>(undefined);
  const [page, setPageState] = useState(1);

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

  // Search commit lên URL (gõ xong debounce hoặc link từ sổ kho) → về trang 1.
  const prevSearchRef = useRef(urlSearch);
  if (prevSearchRef.current !== urlSearch) {
    prevSearchRef.current = urlSearch;
    setPageState(1);
  }

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
      search: urlSearch || undefined,
      page,
      pageSize: 20,
    }),
    [status, warehouse, dateFrom, dateTo, urlSearch, page],
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
