"use client";

import type { Table } from "@tanstack/react-table";
import { Pagination } from "@/components/ui/pagination";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalLabel?: string;
}

export function DataTablePagination<TData>({
  table,
  totalLabel,
}: DataTablePaginationProps<TData>) {
  const filteredCount = table.getFilteredRowModel().rows.length;
  const totalCount = table.getCoreRowModel().rows.length;
  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground tabular-nums">
        {filteredCount} / {totalCount} {totalLabel ?? "dòng"}
      </p>

      <Pagination
        page={pageIndex + 1}
        pageCount={pageCount || 1}
        onPageChange={(next) => table.setPageIndex(next - 1)}
      />
    </div>
  );
}
