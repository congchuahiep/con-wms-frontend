"use client";

import { Delete02Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Material } from "@/features/material";
import { getCategoryColorClass } from "@/features/material-category";

interface ColumnsOptions {
  onEdit: (material: Material) => void;
  onDelete: (material: Material) => void;
}

export function createColumns({
  onEdit,
  onDelete,
}: ColumnsOptions): ColumnDef<Material>[] {
  return [
    {
      id: "code",
      accessorKey: "code",
      header: "Mã",
      cell: ({ getValue }) => <code>{getValue<string>()}</code>,
      size: 140,
      minSize: 100,
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Tên vật tư",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue<string>()}</span>
      ),
      size: 300,
      minSize: 180,
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Danh mục",
      cell: ({ getValue }) => {
        const category = getValue<Material["category"]>();
        return (
          <Badge className={getCategoryColorClass(category.color)}>
            {category.name}
          </Badge>
        );
      },
      size: 160,
      minSize: 120,
    },
    {
      id: "unit",
      accessorKey: "unit",
      header: "Đơn vị",
      cell: ({ getValue }) => {
        const unit = getValue<Material["unit"]>();
        return (
          <span>
            <code>{unit.code}</code> - {unit.name}
          </span>
        );
      },
      size: 130,
      minSize: 100,
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground hidden sm:table-cell truncate">
          {getValue<string>()}
        </span>
      ),
      minSize: 120,
    },
    {
      id: "actions",
      header: "",
      minSize: 80,
      cell: ({ row }) => (
        <div className="flex justify-end gap-0.5">
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => onEdit(row.original)}
          >
            <HugeiconsIcon
              icon={PencilEdit01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => onDelete(row.original)}
          >
            <HugeiconsIcon
              icon={Delete02Icon}
              strokeWidth={2}
              className="size-4 text-destructive"
            />
          </Button>
        </div>
      ),
    },
  ];
}
