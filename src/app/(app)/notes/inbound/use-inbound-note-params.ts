"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import type {
  GetInboundNotesParams,
  InboundNoteStatus,
  InboundNoteType,
} from "@/features/inbound-note";
import { useUrlSearchParam } from "@/hooks/use-url-search-param";

interface InboundNoteParamsState {
  params: GetInboundNotesParams;
  /** Giá trị search tức thời (chưa debounce) — dùng làm value cho ô input. */
  search: string;
  setNoteType: (type?: InboundNoteType) => void;
  setWarehouse: (warehouse?: number) => void;
  setSupplier: (supplier?: number) => void;
  setDateFrom: (date?: string) => void;
  setDateTo: (date?: string) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
}

/**
 * State tập trung cho bộ lọc + phân trang của trang Phiếu nhập.
 *
 * - `search` sống trên URL (`?search=...`) — gõ xong debounce 300ms rồi commit
 *   bằng `router.replace` (hook `useUrlSearchParam`). Link ngoài (vd sổ kho)
 *   vào với `?search=PN-...` tự điền sẵn và lọc sẵn.
 * - Các setter giữ identity ổn định bằng `useCallback` và `params` được
 *   memo hoá, tránh re-render lan truyền do prop thay đổi identity mỗi
 *   lần render.
 */
export function useInboundNoteParams(): InboundNoteParamsState {
  const {
    value: urlSearch,
    inputValue: search,
    setInputValue: setSearch,
  } = useUrlSearchParam("search");
  const [noteType, setNoteTypeState] = useState<InboundNoteType | undefined>(
    undefined,
  );
  const [warehouse, setWarehouseState] = useState<number | undefined>();
  const [supplier, setSupplierState] = useState<number | undefined>(undefined);
  const [dateFrom, setDateFromState] = useState<string | undefined>(undefined);
  const [dateTo, setDateToState] = useState<string | undefined>(undefined);
  const [page, setPageState] = useState(1);

  // Status sống trên URL (?status=...) — NoteStatusTabs ghi trực tiếp bằng router.push.
  const searchParams = useSearchParams();
  const statusRaw = searchParams.get("status");
  const status = (statusRaw as InboundNoteStatus | null) ?? "posted";

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

  const setNoteType = useCallback((next: InboundNoteType | undefined) => {
    setNoteTypeState(next);
    setPageState(1);
  }, []);

  const setWarehouse = useCallback((next: number | undefined) => {
    setWarehouseState(next);
    setPageState(1);
  }, []);

  const setSupplier = useCallback((next: number | undefined) => {
    setSupplierState(next);
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

  const params = useMemo<GetInboundNotesParams>(
    () => ({
      status: status ?? undefined,
      noteType: noteType ?? undefined,
      warehouse: warehouse ?? undefined,
      supplier: supplier ?? undefined,
      dateFrom: dateFrom ?? undefined,
      dateTo: dateTo ?? undefined,
      search: urlSearch || undefined,
      page,
      pageSize: 20,
    }),
    [status, noteType, warehouse, supplier, dateFrom, dateTo, urlSearch, page],
  );

  return {
    params,
    search,
    setNoteType,
    setWarehouse,
    setSupplier,
    setDateFrom,
    setDateTo,
    setSearch,
    setPage,
  };
}
