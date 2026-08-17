"use client";

import type { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { StockMovement } from "@/features/stock";
import { cn } from "@/lib/utils";

interface StockMovementsTableSectionProps {
  table: Table<StockMovement>;
  /** Đang fetch dữ liệu mới trong khi vẫn hiển thị data cũ (placeholder). */
  isRefreshing?: boolean;
}

export function StockMovementsTableSection({
  table,
  isRefreshing = false,
}: StockMovementsTableSectionProps) {
  return (
    <div
      className={cn(
        "flex-1 min-h-0 overflow-auto transition-opacity duration-150",
        isRefreshing && "opacity-60",
      )}
    >
      <DataTable table={table} emptyPlaceholder="Chưa có dòng ghi sổ nào" />
    </div>
  );
}
