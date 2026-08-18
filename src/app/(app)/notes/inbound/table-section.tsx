"use client";

import type { Row, Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { InboundNote } from "@/features/inbound-note";
import { cn } from "@/lib/utils";

interface InboundNotesTableSectionProps {
  table: Table<InboundNote>;
  /** Đang fetch dữ liệu mới trong khi vẫn hiển thị data cũ (placeholder). */
  isRefreshing?: boolean;
  /** Đang fetch lần đầu, chưa có dữ liệu để hiển thị. */
  isLoading?: boolean;
  /** Nội dung mở rộng dưới mỗi row (chi tiết phiếu). */
  renderExpandedRow?: (row: Row<InboundNote>) => React.ReactNode;
}

export function InboundNotesTableSection({
  table,
  isRefreshing = false,
  isLoading = false,
  renderExpandedRow,
}: InboundNotesTableSectionProps) {
  return (
    <DataTable
      className={cn(
        "flex-1 min-h-0 transition-opacity duration-150",
        isRefreshing && "opacity-60",
      )}
      table={table}
      isLoading={isLoading}
      emptyPlaceholder="Chưa có phiếu nhập nào"
      renderExpandedRow={renderExpandedRow}
    />
  );
}
