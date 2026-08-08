"use client";

import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  DashedLine02Icon,
  Delete02Icon,
  PencilEdit01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MaterialCategory } from "@/features/material-category";
import {
  getCategoryColorClass,
  getCategoryColorLabel,
} from "@/features/material-category";

interface ColumnsOptions {
  onEdit: (category: MaterialCategory) => void;
  onDelete: (category: MaterialCategory) => void;
}

export function createColumns({ onEdit, onDelete }: ColumnsOptions): ColumnDef<MaterialCategory>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: "Tên danh mục",
      cell: ({ row, getValue }) => {
        const canExpand = row.getCanExpand();
        const isExpanded = row.getIsExpanded();

        return (
          <div className="flex items-center gap-1 -m-2 pl-2">
            {row.depth !== 0 &&
              Array(row.depth)
                .fill(0)
                .map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static element
                  <div key={i} className="bg-border w-px h-10 mx-3" />
                ))}

            {canExpand ? (
              <Button
                size="icon-xs"
                variant="outline"
                onClick={row.getToggleExpandedHandler()}
              >
                <HugeiconsIcon
                  icon={isExpanded ? ArrowDown01Icon : ArrowRight01Icon}
                  strokeWidth={2}
                  className="size-4 text-muted-foreground"
                />
              </Button>
            ) : (
              <div className="w-6 flex justify-center">
                <HugeiconsIcon
                  icon={DashedLine02Icon}
                  strokeWidth={2}
                  className="size-4 text-muted-foreground"
                />
              </div>
            )}
            <span className="ml-0.5 font-medium">{getValue<string>()}</span>
          </div>
        );
      },
      size: 350,
      minSize: 200,
    },
    {
      id: "code",
      accessorKey: "code",
      header: "Mã",
      cell: ({ getValue }) => <code>{getValue<string>()}</code>,
      size: 120,
      minSize: 80,
    },
    {
      id: "color",
      accessorKey: "color",
      header: "Màu sắc",
      cell: ({ getValue }) => {
        const color = getValue<string | null>();

        return (
          <Badge className={getCategoryColorClass(color)}>
            {getCategoryColorLabel(color)}
          </Badge>
        );
      },
      minSize: 100,
    },
    {
      id: "actions",
      header: "",
      minSize: 40,
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
