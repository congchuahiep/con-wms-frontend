"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { authApi } from "@/configs/api";
import { stockKeys } from "@/configs/querykeys";
import type { AppError } from "@/errors";
import type { Paginated } from "@/types";
import type {
  GetStockMovementsParams,
  GetStockParams,
  StockBalance,
  StockMovement,
} from "./types";

/**
 * Chuẩn hoá params thành object có shape + thứ tự key cố định để query
 * key của React Query luôn ổn định với cùng một bộ lọc (hash theo cấu
 * trúc, không phụ thuộc thứ tự key hay giá trị `undefined` gửi từ caller).
 */
function normalizeBalanceParams(params: GetStockParams) {
  return {
    search: params.search ?? "",
    warehouse: params.warehouse ?? null,
    material: params.material ?? null,
    category: params.category ?? null,
    hasStock: params.hasStock ?? null,
  };
}

function normalizeMovementParams(params: GetStockMovementsParams) {
  return {
    material: params.material ?? null,
    warehouse: params.warehouse ?? null,
    movementType: params.movementType ?? null,
    dateFrom: params.dateFrom ?? null,
    dateTo: params.dateTo ?? null,
    inboundNote: params.inboundNote ?? null,
    originalsOnly: params.originalsOnly ?? null,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 50,
  };
}

/**
 * Tồn kho hiện tại — mảng phẳng, không phân trang.
 * Feature read-only: không có mutation (dòng sổ kho chỉ sinh qua chốt/hủy phiếu).
 */
export function useGetStockBalances(params: GetStockParams = {}) {
  const normalizedParams = normalizeBalanceParams(params);

  return useQuery<StockBalance[], AppError>({
    queryKey: stockKeys.balances(normalizedParams),
    queryFn: async ({ signal }) => {
      const response = await authApi.get<StockBalance[]>(
        (ep) => ep.stock.balances,
        { params: normalizedParams, signal },
      );
      return response.data;
    },
    // Giữ data của lần query trước khi đổi filter để bảng không bị xoá
    // trắng + remount mỗi lần đổi param (dùng isPlaceholderData để phân
    // biệt data cũ đang được hiển thị).
    placeholderData: keepPreviousData,
  });
}

/** Sổ kho — phân trang, sắp xếp `-date, -id` (backend). */
export function useGetStockMovements(params: GetStockMovementsParams = {}) {
  const normalizedParams = normalizeMovementParams(params);

  return useQuery<Paginated<StockMovement>, AppError>({
    queryKey: stockKeys.movements(normalizedParams),
    queryFn: async ({ signal }) => {
      const response = await authApi.get<Paginated<StockMovement>>(
        (ep) => ep.stock.movements,
        { params: normalizedParams, signal },
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
}
