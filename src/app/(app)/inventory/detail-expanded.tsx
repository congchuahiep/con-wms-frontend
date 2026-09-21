"use client";

import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import type {
  StockBalanceSummary,
  StockBalanceWarehouse,
} from "@/features/stock";
import { cn } from "@/lib/utils";
import { formatDecimal, formatMoney } from "@/utils/format";

interface InventoryDetailExpandedProps {
  /** Dòng vật tư đang mở rộng — `warehouseBalances` đã gộp sẵn, không fetch thêm. */
  summary: StockBalanceSummary;
}

/**
 * Chi tiết tồn theo từng kho trong expanded row của bảng Tồn kho.
 * Giá trị tồn theo kho = quantity × giá nhập gần nhất CỦA VẬT TƯ
 * (`summary.lastPurchasePrice`) — theo yêu cầu v1.6.
 */
export function InventoryDetailExpanded({
  summary,
}: InventoryDetailExpandedProps) {
  const columns = useMemo(() => createExpandedColumns(summary), [summary]);

  const table = useReactTable({
    data: summary.warehouseBalances,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Cho phép người dùng sort bảng con bằng cách bấm header (không sort mặc định).
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="ml-10 border-l bg-background">
      <DataTable
        table={table}
        stickyHeader={false}
        emptyPlaceholder="Không có dòng tồn theo kho"
      />
    </div>
  );
}

/**
 * Column defs là factory vì cột Giá trị tồn phụ thuộc `summary.lastPurchasePrice`
 * — không nằm trong dữ liệu của từng dòng kho.
 */
function createExpandedColumns(
  summary: StockBalanceSummary,
): ColumnDef<StockBalanceWarehouse>[] {
  return [
    {
      id: "warehouse",
      accessorFn: (row) => row.warehouse.name,
      header: "Kho",
      cell: ({ row }) => (
        <span className="whitespace-normal">
          <span className="text-muted-foreground">
            {row.original.warehouse.name}
          </span>
        </span>
      ),
      size: 320,
      minSize: 160,
    },
    {
      id: "quantity",
      accessorFn: (row) => Number(row.quantity),
      header: "Số lượng",
      cell: ({ row }) => {
        const quantity = Number(row.original.quantity);
        return (
          <span
            className={cn(
              "block text-right tabular-nums font-medium",
              quantity <= 0 && "text-destructive",
            )}
          >
            {formatDecimal(row.original.quantity)}
          </span>
        );
      },
      size: 110,
      minSize: 90,
    },
    {
      id: "stockValue",
      accessorFn: (row) =>
        summary.lastPurchasePrice === null
          ? Number.NEGATIVE_INFINITY
          : Number(row.quantity) * Number(summary.lastPurchasePrice),
      header: "Giá trị tồn",
      cell: ({ row }) => (
        <span className="block text-right tabular-nums">
          {formatMoney(
            summary.lastPurchasePrice === null
              ? null
              : Number(row.original.quantity) *
                  Number(summary.lastPurchasePrice),
            2,
          )}
        </span>
      ),
      size: 150,
      minSize: 110,
    },
  ];
}
