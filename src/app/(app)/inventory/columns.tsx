"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { InventoryRow } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<InventoryRow>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên vật tư",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Danh mục",
    cell: ({ getValue }) => (
      <Badge variant="secondary" className="text-xs">
        {getValue<string>()}
      </Badge>
    ),
  },
  {
    accessorKey: "warehouseName",
    header: "Kho",
    cell: ({ getValue }) => (
      <Badge variant="outline" className="text-xs">
        {getValue<string>()}
      </Badge>
    ),
  },
  {
    accessorKey: "unit",
    header: "Đơn vị",
  },
  {
    accessorKey: "location",
    header: "Vị trí",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Tồn kho",
    cell: ({ getValue }) => {
      const qty = getValue<number>();
      return (
        <span
          className={cn(
            "text-right tabular-nums font-medium",
            qty < 50 && "text-destructive",
          )}
        >
          {qty.toLocaleString("vi-VN")}
        </span>
      );
    },
  },
];
