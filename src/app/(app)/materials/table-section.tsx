"use client";

import type { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { Material } from "@/features/material";
import { cn } from "@/lib/utils";

interface MaterialsTableSectionProps {
  table: Table<Material>;
  /** Đang fetch dữ liệu mới trong khi vẫn hiển thị data cũ (placeholder). */
  isRefreshing?: boolean;
}

export function MaterialsTableSection({
  table,
  isRefreshing = false,
}: MaterialsTableSectionProps) {
  return (
    <div
      className={cn(
        "flex-1 min-h-0 overflow-auto transition-opacity duration-150",
        isRefreshing && "opacity-60",
      )}
    >
      <DataTable table={table} />
    </div>
  );
}
