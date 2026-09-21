"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import type {
  GetOutboundNotesParams,
  OutboundNoteStatus,
  OutboundNoteType,
} from "@/features/outbound-note";
import { useUrlSearchParam } from "@/hooks/use-url-search-param";

interface OutboundNoteParamsState {
  params: GetOutboundNotesParams;
  /** Giá trị search tức thời (chưa debounce) — dùng làm value cho ô input. */
  search: string;
  setNoteType: (type?: OutboundNoteType) => void;
  setWarehouse: (warehouse?: number) => void;
  setToWarehouse: (toWarehouse?: number) => void;
  setSite: (site?: number) => void;
  setDateFrom: (date?: string) => void;
  setDateTo: (date?: string) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
}

/**
 * State tập trung cho bộ lọc + phân trang của trang Phiếu xuất.
 *
 * - `search` sống trên URL (`?search=...`) — debounce 300ms rồi commit bằng
 *   `router.replace` (hook `useUrlSearchParam`). Link ngoài lọc sẵn bằng mã.
 * - Các setter giữ identity ổn định bằng `useCallback`.
 */
export function useOutboundNoteParams(): OutboundNoteParamsState {
  const {
    value: urlSearch,
    inputValue: search,
    setInputValue: setSearch,
  } = useUrlSearchParam("search");
  const [noteType, setNoteTypeState] = useState<OutboundNoteType | undefined>(
    undefined,
  );
  const [warehouse, setWarehouseState] = useState<number | undefined>();
  const [toWarehouse, setToWarehouseState] = useState<number | undefined>();
  const [site, setSiteState] = useState<number | undefined>();
  const [dateFrom, setDateFromState] = useState<string | undefined>(undefined);
  const [dateTo, setDateToState] = useState<string | undefined>(undefined);
  const [page, setPageState] = useState(1);

  // Status sống trên URL (?status=...) — NoteStatusTabs ghi trực tiếp bằng router.push.
  const searchParams = useSearchParams();
  const statusRaw = searchParams.get("status");
  const status = (statusRaw as OutboundNoteStatus | null) ?? "posted";

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

  const setNoteType = useCallback((next: OutboundNoteType | undefined) => {
    setNoteTypeState(next);
    setPageState(1);
  }, []);

  const setWarehouse = useCallback((next: number | undefined) => {
    setWarehouseState(next);
    setPageState(1);
  }, []);

  const setToWarehouse = useCallback((next: number | undefined) => {
    setToWarehouseState(next);
    setPageState(1);
  }, []);

  const setSite = useCallback((next: number | undefined) => {
    setSiteState(next);
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

  const params = useMemo<GetOutboundNotesParams>(
    () => ({
      status: status ?? undefined,
      noteType: noteType ?? undefined,
      warehouse: warehouse ?? undefined,
      toWarehouse: toWarehouse ?? undefined,
      site: site ?? undefined,
      dateFrom: dateFrom ?? undefined,
      dateTo: dateTo ?? undefined,
      search: urlSearch || undefined,
      page,
      pageSize: 20,
    }),
    [
      status,
      noteType,
      warehouse,
      toWarehouse,
      site,
      dateFrom,
      dateTo,
      urlSearch,
      page,
    ],
  );

  return {
    params,
    search,
    setNoteType,
    setWarehouse,
    setToWarehouse,
    setSite,
    setDateFrom,
    setDateTo,
    setSearch,
    setPage,
  };
}
