"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Material } from "@/lib/mock/data";

export const columns: ColumnDef<Material>[] = [
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
    accessorKey: "unit",
    header: "Đơn vị",
  },
  {
    accessorKey: "spec",
    header: "Quy cách",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground hidden sm:table-cell">
        {getValue<string>()}
      </span>
    ),
  },
];
