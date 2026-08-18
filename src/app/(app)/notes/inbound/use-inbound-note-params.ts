"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  GetInboundNotesParams,
  InboundNoteStatus,
  InboundNoteType,
} from "@/features/inbound-note";

const SEARCH_DEBOUNCE_MS = 300;

interface InboundNoteParamsState {
  params: GetInboundNotesParams;
  /** Giá trị search tức thời (chưa debounce) — dùng làm value cho ô input. */
  search: string;
  setStatus: (status: InboundNoteStatus | null) => void;
  setNoteType: (type: InboundNoteType | null) => void;
  setWarehouse: (warehouse: number | null) => void;
  setSupplier: (supplier: number | null) => void;
  setDateFrom: (date: string | null) => void;
  setDateTo: (date: string | null) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
}

/**
 * State tập trung cho bộ lọc + phân trang của trang Phiếu nhập.
 *
 * - `search` được debounce trước khi đưa vào `params` để mỗi phím gõ
 *   không tạo ra một query + re-render cả cây component.
 * - Các setter giữ identity ổn định bằng `useCallback` và `params` được
 *   memo hoá, tránh re-render lan truyền do prop thay đổi identity mỗi
 *   lần render.
 */
export function useInboundNoteParams(): InboundNoteParamsState {
  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatusState] = useState<InboundNoteStatus | null>("draft");
  const [noteType, setNoteTypeState] = useState<InboundNoteType | null>(null);
  const [warehouse, setWarehouseState] = useState<number | null>(null);
  const [supplier, setSupplierState] = useState<number | null>(null);
  const [dateFrom, setDateFromState] = useState<string | null>(null);
  const [dateTo, setDateToState] = useState<string | null>(null);
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

  const setStatus = useCallback((next: InboundNoteStatus | null) => {
    setStatusState(next);
    setPageState(1);
  }, []);

  const setNoteType = useCallback((next: InboundNoteType | null) => {
    setNoteTypeState(next);
    setPageState(1);
  }, []);

  const setWarehouse = useCallback((next: number | null) => {
    setWarehouseState(next);
    setPageState(1);
  }, []);

  const setSupplier = useCallback((next: number | null) => {
    setSupplierState(next);
    setPageState(1);
  }, []);

  const setDateFrom = useCallback((next: string | null) => {
    setDateFromState(next);
    setPageState(1);
  }, []);

  const setDateTo = useCallback((next: string | null) => {
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
      search: debouncedSearch || undefined,
      page,
      pageSize: 20,
    }),
    [
      status,
      noteType,
      warehouse,
      supplier,
      dateFrom,
      dateTo,
      debouncedSearch,
      page,
    ],
  );

  return {
    params,
    search,
    setStatus,
    setNoteType,
    setWarehouse,
    setSupplier,
    setDateFrom,
    setDateTo,
    setSearch,
    setPage,
  };
}
