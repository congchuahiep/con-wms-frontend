"use client"

import type { Table } from "@tanstack/react-table"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  totalLabel?: string
}

export function DataTablePagination<TData>({
  table,
  totalLabel,
}: DataTablePaginationProps<TData>) {
  const filteredCount = table.getFilteredRowModel().rows.length
  const totalCount = table.getCoreRowModel().rows.length
  const pageCount = table.getPageCount()
  const pageIndex = table.getState().pagination.pageIndex

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground tabular-nums">
        {filteredCount} / {totalCount} {totalLabel ?? "dòng"}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
        </Button>
        <span className="min-w-16 text-center text-sm tabular-nums">
          {pageIndex + 1} / {pageCount || 1}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
        </Button>
      </div>
    </div>
  )
}
