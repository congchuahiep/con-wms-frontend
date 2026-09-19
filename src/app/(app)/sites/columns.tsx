"use client";
import { Delete02Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { Site } from "@/features/site";
export function createColumns({ onEdit, onDelete }: { onEdit: (s: Site) => void; onDelete: (s: Site) => void }): ColumnDef<Site>[] {
  return [
    { id: "code", accessorKey: "code", header: "Mã", cell: ({ getValue }) => <code>{getValue<string>()}</code>, size: 140, minSize: 100 },
    { id: "name", accessorKey: "name", header: "Tên công trường", cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>, size: 320, minSize: 200 },
    { id: "manager", accessorKey: "manager", header: "Phụ trách", cell: ({ getValue }) => <span>{getValue<string>() || "—"}</span>, size: 180, minSize: 140 },
    { id: "phone", accessorKey: "phone", header: "SĐT", cell: ({ getValue }) => <span>{getValue<string>() || "—"}</span>, size: 140, minSize: 110 },
    { id: "address", accessorKey: "address", header: "Địa chỉ", cell: ({ getValue }) => <span className="truncate text-muted-foreground">{getValue<string>() || "—"}</span>, size: 220, minSize: 160 },
    { id: "actions", header: "", minSize: 80, cell: ({ row }) => (
        <div className="flex justify-end gap-0.5">
          <Button size="icon-xs" variant="ghost" onClick={() => onEdit(row.original)}><HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-4" /></Button>
          <Button size="icon-xs" variant="ghost" onClick={() => onDelete(row.original)}><HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-4 text-destructive" /></Button>
        </div>
      ) },
  ];
}
