"use client";

import { Delete02Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { Unit } from "@/features/unit";

interface ColumnsOptions {
  onEdit: (unit: Unit) => void;
  onDelete: (unit: Unit) => void;
}

export function createColumns({
  onEdit,
  onDelete,
}: ColumnsOptions): ColumnDef<Unit>[] {
  return [
    {
      id: "code",
      accessorKey: "code",
      header: "Mã",
      cell: ({ getValue }) => <code>{getValue<string>()}</code>,
      size: 120,
      minSize: 80,
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Tên",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue<string>()}</span>
      ),
      size: 350,
      minSize: 200,
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
