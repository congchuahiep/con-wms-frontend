"use client";

import { useCallback, useMemo, useState } from "react";
import type { GetStockMovementsParams, MovementType } from "@/features/stock";

interface StockMovementParamsState {
  params: GetStockMovementsParams;
  setWarehouse: (warehouse: number | null) => void;
  setMovementType: (type: MovementType | null) => void;
  setMaterial: (material: number | null) => void;
  setDateFrom: (date: string | null) => void;
  setDateTo: (date: string | null) => void;
  setShowReversals: (show: boolean) => void;
  setPage: (page: number) => void;
}

/**
 * State tập trung cho bộ lọc + phân trang của trang Sổ kho.
 *
 * Các setter giữ identity ổn định bằng `useCallback` và `params` được memo
 * hoá — tránh re-render lan truyền do prop thay đổi identity mỗi lần render
 * (cùng nguyên nhân gây đơ trang Vật tư trước đây).
 */
export function useStockMovementParams(): StockMovementParamsState {
  const [warehouse, setWarehouseState] = useState<number | null>(null);
  const [movementType, setMovementTypeState] = useState<MovementType | null>(
    null,
  );
  const [material, setMaterialState] = useState<number | null>(null);
  const [dateFrom, setDateFromState] = useState<string | null>(null);
  const [dateTo, setDateToState] = useState<string | null>(null);
  const [showReversals, setShowReversalsState] = useState(false);
  const [page, setPageState] = useState(1);

  const setWarehouse = useCallback((next: number | null) => {
    setWarehouseState(next);
    setPageState(1);
  }, []);

  const setMovementType = useCallback((next: MovementType | null) => {
    setMovementTypeState(next);
    setPageState(1);
  }, []);

  const setMaterial = useCallback((next: number | null) => {
    setMaterialState(next);
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

  // originalsOnly mặc định true (backend) — switch "Hiện dòng hủy" bật → false
  const setShowReversals = useCallback((show: boolean) => {
    setShowReversalsState(show);
    setPageState(1);
  }, []);

  const setPage = useCallback((next: number) => {
    setPageState(next);
  }, []);

  const params = useMemo<GetStockMovementsParams>(
    () => ({
      warehouse: warehouse ?? undefined,
      movementType: movementType ?? undefined,
      material: material ?? undefined,
      dateFrom: dateFrom ?? undefined,
      dateTo: dateTo ?? undefined,
      originalsOnly: showReversals ? false : undefined,
      page,
      pageSize: 50,
    }),
    [warehouse, movementType, material, dateFrom, dateTo, showReversals, page],
  );

  return {
    params,
    setWarehouse,
    setMovementType,
    setMaterial,
    setDateFrom,
    setDateTo,
    setShowReversals,
    setPage,
  };
}
