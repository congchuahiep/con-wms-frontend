"use client";

import { Delete02Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { Unit } from "@/features/unit";
import { CONVERSION_TYPE_LABELS } from "@/features/unit";

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
      id: "conversionType",
      accessorKey: "conversionType",
      header: "Loại quy đổi",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return (
          <span
            className="text-muted-foreground text-sm"
            title={
              value === "global"
                ? "Quy đổi cố định, áp dụng cho mọi vật tư (VD: 1 tấn = 1000 kg)"
                : "Quy đổi phụ thuộc vào loại vật tư cụ thể (VD: 1 bao xi măng = 50 kg, 1 bao ốc vít = 500 g)"
            }
          >
            {CONVERSION_TYPE_LABELS[value] ?? value}
          </span>
        );
      },
      size: 140,
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
