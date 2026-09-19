"use client";

import type { Row, Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { OutboundNote } from "@/features/outbound-note";
import { cn } from "@/lib/utils";

interface OutboundNotesTableSectionProps {
  table: Table<OutboundNote>;
  /** Đang fetch dữ liệu mới trong khi vẫn hiển thị data cũ (placeholder). */
  isRefreshing?: boolean;
  /** Đang fetch lần đầu, chưa có dữ liệu để hiển thị. */
  isLoading?: boolean;
  /** Nội dung mở rộng dưới mỗi row (chi tiết phiếu). */
  renderExpandedRow?: (row: Row<OutboundNote>) => React.ReactNode;
}

export function OutboundNotesTableSection({
  table,
  isRefreshing = false,
  isLoading = false,
  renderExpandedRow,
}: OutboundNotesTableSectionProps) {
  return (
    <DataTable
      className={cn(
        "flex-1 min-h-0 transition-opacity duration-150",
        isRefreshing && "opacity-60",
      )}
      table={table}
      isLoading={isLoading}
      emptyPlaceholder="Chưa có phiếu xuất nào"
      renderExpandedRow={renderExpandedRow}
    />
  );
}
