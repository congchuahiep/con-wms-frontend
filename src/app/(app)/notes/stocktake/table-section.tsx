"use client";

import type { Row, Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { StocktakeNote } from "@/features/stocktake";
import { cn } from "@/lib/utils";

interface StocktakeNotesTableSectionProps {
  table: Table<StocktakeNote>;
  isRefreshing?: boolean;
  isLoading?: boolean;
  renderExpandedRow?: (row: Row<StocktakeNote>) => React.ReactNode;
}

export function StocktakeNotesTableSection({
  table,
  isRefreshing = false,
  isLoading = false,
  renderExpandedRow,
}: StocktakeNotesTableSectionProps) {
  return (
    <DataTable
      className={cn(
        "flex-1 min-h-0 transition-opacity duration-150",
        isRefreshing && "opacity-60",
      )}
      table={table}
      isLoading={isLoading}
      emptyPlaceholder="Chưa có phiếu kiểm kê nào"
      renderExpandedRow={renderExpandedRow}
    />
  );
}
