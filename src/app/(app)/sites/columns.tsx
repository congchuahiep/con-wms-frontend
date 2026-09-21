"use client";

import {
  Delete02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Site } from "@/features/site";
import { siteStatusLabel } from "@/features/site";
import { cn } from "@/lib/utils";

interface ColumnsOptions {
  onDelete: (site: Site) => void;
  /** Chỉ admin mới được xóa/vô hiệu hóa (backend IsAdmin) — ẩn nút khi user không có quyền. */
  canModify?: boolean;
}

function StatusBadge({ status }: { status: Site["status"] }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs",
        status === "active" &&
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
        status === "completed" &&
          "border-sky-500/30 bg-sky-500/10 text-sky-600",
        status === "inactive" && "border-border bg-muted text-muted-foreground",
      )}
    >
      {siteStatusLabel(status)}
    </Badge>
  );
}

export function createColumns({
  onDelete,
  canModify = true,
}: ColumnsOptions): ColumnDef<Site>[] {
  return [
    {
      id: "code",
      accessorKey: "code",
      header: "Mã",
      cell: ({ getValue, row }) => (
        <Link href={`/sites/${row.original.id}`}>
          <code className="hover:underline">{getValue<string>()}</code>
        </Link>
      ),
      size: 140,
      minSize: 100,
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Tên công trường",
      cell: ({ getValue, row }) => (
        <Link
          href={`/sites/${row.original.id}`}
          className="font-medium hover:underline text-blue-800"
        >
          {getValue<string>()}
        </Link>
      ),
      size: 320,
      minSize: 200,
    },
    {
      id: "manager",
      accessorKey: "manager",
      header: "Phụ trách",
      cell: ({ getValue }) => <span>{getValue<string>() || "—"}</span>,
      size: 180,
      minSize: 140,
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: "SĐT",
      cell: ({ getValue }) => <span>{getValue<string>() || "—"}</span>,
      size: 140,
      minSize: 110,
    },
    {
      id: "address",
      accessorKey: "address",
      header: "Địa chỉ",
      cell: ({ getValue }) => (
        <span className="truncate text-muted-foreground">
          {getValue<string>() || "—"}
        </span>
      ),
      size: 220,
      minSize: 160,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ getValue }) => (
        <StatusBadge status={getValue<Site["status"]>()} />
      ),
      size: 140,
      minSize: 120,
    },
    {
      id: "warehouse",
      accessorKey: "warehouse",
      header: "Kho công trường",
      cell: ({ getValue }) => {
        const warehouse = getValue<Site["warehouse"]>();
        return warehouse ? (
          <code className="text-xs">{warehouse.code}</code>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      size: 150,
      minSize: 120,
    },
    {
      id: "actions",
      header: "",
      minSize: 140,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            size="xs"
            variant="secondary"
            aria-label="Sửa công trường"
            nativeButton={false}
            render={<Link href={`/sites/${row.original.id}`}>Chi tiết</Link>}
          >
            <HugeiconsIcon
              icon={InformationCircleIcon}
              strokeWidth={2}
              className="size-4"
            />
            Chi tiết
          </Button>
          {canModify && (
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => onDelete(row.original)}
              disabled={row.original.status !== "active"}
              aria-label="Vô hiệu hóa công trường"
            >
              <HugeiconsIcon
                icon={Delete02Icon}
                strokeWidth={2}
                className="size-4 text-destructive"
              />
            </Button>
          )}
        </div>
      ),
    },
  ];
}
