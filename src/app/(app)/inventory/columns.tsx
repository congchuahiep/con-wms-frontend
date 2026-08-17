"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { StockBalance } from "@/features/stock";
import { cn } from "@/lib/utils";
import { formatDecimal } from "@/utils/format";

export const columns: ColumnDef<StockBalance>[] = [
  {
    id: "code",
    accessorKey: "material.code",
    header: "Mã",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue<string>()}</span>
    ),
    size: 120,
    minSize: 90,
  },
  {
    id: "name",
    accessorKey: "material.name",
    header: "Tên vật tư",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string>()}</span>
    ),
    size: 250,
    minSize: 180,
  },
  {
    id: "warehouse",
    accessorKey: "warehouse.name",
    header: "Kho",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue<string>()}</span>
    ),
    size: 180,
    minSize: 120,
  },
  {
    id: "unit",
    accessorKey: "unit.code",
    header: "ĐVT",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue<string>()}</span>
    ),
    size: 80,
    minSize: 60,
  },
  {
    id: "quantity",
    accessorFn: (row) => Number(row.quantity),
    header: "Tồn kho",
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
    size: 100,
    minSize: 80,
  },
  {
    id: "lastPurchasePrice",
    accessorFn: (row) =>
      row.lastPurchasePrice === null
        ? Number.NEGATIVE_INFINITY
        : Number(row.lastPurchasePrice),
    header: "Giá nhập gần nhất",
    cell: ({ row }) => (
      <span className="block text-right tabular-nums">
        {formatDecimal(row.original.lastPurchasePrice, 2)}
      </span>
    ),
    size: 150,
    minSize: 110,
  },
  {
    id: "stockValue",
    accessorFn: (row) =>
      row.stockValue === null
        ? Number.NEGATIVE_INFINITY
        : Number(row.stockValue),
    header: "Giá trị tồn",
    cell: ({ row }) => (
      <span className="block text-right tabular-nums font-medium">
        {formatDecimal(row.original.stockValue, 2)}
      </span>
    ),
    size: 160,
    minSize: 120,
  },
];
