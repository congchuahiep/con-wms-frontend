"use client";

import type { Row, Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { StockBalanceSummary } from "@/features/stock";
import { cn } from "@/lib/utils";

interface InventoryTableSectionProps {
  table: Table<StockBalanceSummary>;
  /** Đang fetch dữ liệu mới trong khi vẫn hiển thị data cũ (placeholder). */
  isRefreshing?: boolean;
  /** Nội dung mở rộng dưới mỗi row (tồn theo từng kho). */
  renderExpandedRow?: (row: Row<StockBalanceSummary>) => React.ReactNode;
}

export function InventoryTableSection({
  table,
  isRefreshing = false,
  renderExpandedRow,
}: InventoryTableSectionProps) {
  return (
    <div
      className={cn(
        "flex-1 min-h-0 overflow-auto transition-opacity duration-150",
        isRefreshing && "opacity-60",
      )}
    >
      <DataTable
        table={table}
        emptyPlaceholder="Chưa có dữ liệu tồn kho"
        renderExpandedRow={renderExpandedRow}
      />
    </div>
  );
}
