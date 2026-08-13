"use client";

import { Delete02Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { Supplier } from "@/features/supplier";

interface ColumnsOptions {
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export function createColumns({
  onEdit,
  onDelete,
}: ColumnsOptions): ColumnDef<Supplier>[] {
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
      header: "Tên nhà cung cấp",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue<string>()}</span>
      ),
      size: 320,
      minSize: 200,
    },
    {
      id: "contactPerson",
      accessorKey: "contactPerson",
      header: "Người liên hệ",
      cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      size: 180,
      minSize: 140,
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: "SĐT",
      cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      size: 140,
      minSize: 110,
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground hidden sm:table-cell truncate">
          {getValue<string>()}
        </span>
      ),
      size: 200,
      minSize: 140,
    },
    {
      id: "taxCode",
      accessorKey: "taxCode",
      header: "MST",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground hidden sm:table-cell truncate">
          {getValue<string>()}
        </span>
      ),
      size: 140,
      minSize: 110,
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
