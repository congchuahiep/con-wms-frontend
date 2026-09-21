"use client";

import { ChevronDownIcon, ChevronRightIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getCategoryColorClass,
  type SimpleMaterialCategory,
} from "@/features/material-category";
import type { StockBalanceSummary } from "@/features/stock";
import { cn } from "@/lib/utils";
import { formatDecimal, formatMoney } from "@/utils/format";

export const columns: ColumnDef<StockBalanceSummary>[] = [
  {
    id: "expander",
    header: "",
    size: 40,
    maxSize: 40,
    enableSorting: false,
    cell: ({ row }) => (
      <Button
        size="icon-xs"
        variant="ghost"
        aria-label={
          row.getIsExpanded()
            ? "Thu gọn chi tiết theo kho"
            : "Xem chi tiết theo kho"
        }
        aria-expanded={row.getIsExpanded()}
        onClick={row.getToggleExpandedHandler()}
      >
        <HugeiconsIcon
          icon={row.getIsExpanded() ? ChevronDownIcon : ChevronRightIcon}
          strokeWidth={2}
          className="size-4"
        />
      </Button>
    ),
  },
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
    id: "category",
    accessorKey: "material.category",
    header: "Danh mục",
    cell: ({ getValue }) => {
      const category = getValue<SimpleMaterialCategory>();

      return (
        <div>
          <Badge className={getCategoryColorClass(category.color)}>
            {category.name}
          </Badge>
        </div>
      );
    },
    size: 120,
    minSize: 60,
  },
  {
    id: "warehouses",
    accessorFn: (row) =>
      row.warehouseBalances.map((w) => w.warehouse.name).join(", "),
    header: "Các kho có vật liệu này",
    cell: ({ row }) => {
      const warehouses = row.original.warehouseBalances.map((b) => b.warehouse);
      if (warehouses.length === 0)
        return <span className="text-muted-foreground">—</span>;
      return (
        <div className="flex flex-wrap items-center gap-1">
          {warehouses.map((warehouse) => (
            <Badge
              key={warehouse.id}
              variant="outline"
              title={warehouse.name}
              className="max-w-44 truncate text-xs font-normal text-muted-foreground"
            >
              {warehouse.name}
            </Badge>
          ))}
        </div>
      );
    },
    size: 220,
    minSize: 160,
  },
  {
    id: "totalQuantity",
    accessorFn: (row) => Number(row.totalQuantity),
    header: "Tồn kho",
    cell: ({ row }) => {
      const quantity = Number(row.original.totalQuantity);
      return (
        <span
          className={cn(
            "block text-right tabular-nums font-medium",
            quantity <= 0 && "text-destructive",
          )}
        >
          {formatDecimal(row.original.totalQuantity)}
        </span>
      );
    },
    size: 100,
    minSize: 80,
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
    id: "lastPurchasePrice",
    accessorFn: (row) =>
      row.lastPurchasePrice === null
        ? Number.NEGATIVE_INFINITY
        : Number(row.lastPurchasePrice),
    header: "Giá nhập gần nhất",
    cell: ({ row }) => (
      <span className="block text-right tabular-nums">
        {formatMoney(row.original.lastPurchasePrice, 2)}
      </span>
    ),
    size: 150,
    minSize: 110,
  },
  {
    id: "totalStockValue",
    accessorFn: (row) =>
      row.totalStockValue === null
        ? Number.NEGATIVE_INFINITY
        : Number(row.totalStockValue),
    header: "Giá trị tồn",
    cell: ({ row }) => (
      <span className="block text-right tabular-nums font-medium">
        {formatMoney(row.original.totalStockValue, 2)}
      </span>
    ),
    size: 160,
    minSize: 120,
  },
];
