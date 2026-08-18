"use client";

import {
  CheckmarkBadge01Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  Delete02Icon,
  MoreVerticalIcon,
  MultiplicationSignCircleIcon,
  PencilEdit01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getNoteStatusColorClass,
  type InboundNote,
} from "@/features/inbound-note";
import { getInboundNoteTypeColorClass } from "@/features/stock";
import type { SimpleSupplier } from "@/features/supplier";
import { cn } from "@/lib/utils";
import { formatDate, formatDecimal } from "@/utils/format";

interface ColumnsOptions {
  onEdit: (note: InboundNote) => void;
  onDelete: (note: InboundNote) => void;
  onFinalize: (note: InboundNote) => void;
  onVoid: (note: InboundNote) => void;
}

export function createColumns({
  onEdit,
  onDelete,
  onFinalize,
  onVoid,
}: ColumnsOptions): ColumnDef<InboundNote>[] {
  return [
    {
      id: "expander",
      header: "",
      size: 40,
      maxSize: 40,
      cell: ({ row }) => (
        <Button
          size="icon-xs"
          variant="ghost"
          aria-label={row.getIsExpanded() ? "Thu gọn chi tiết" : "Xem chi tiết"}
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
      id: "number",
      accessorKey: "number",
      header: "Số phiếu",
      cell: ({ getValue }) => (
        <code title={getValue<string>()} className="text-primary">
          {getValue<string>()}
        </code>
      ),
      size: 140,
      minSize: 140,
    },
    {
      id: "date",
      accessorKey: "date",
      header: "Ngày",
      cell: ({ getValue }) => (
        <span className="italic">{formatDate(getValue<string>())}</span>
      ),
      size: 100,
      minSize: 100,
    },
    {
      id: "noteType",
      accessorKey: "noteTypeLabel",
      header: "Loại",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "max-w-full",
            getInboundNoteTypeColorClass(row.original.noteType),
          )}
          title={row.original.noteTypeLabel}
        >
          <span className="block min-w-0 truncate">
            {row.original.noteTypeLabel}
          </span>
        </Badge>
      ),
      size: 190,
      minSize: 190,
    },
    {
      id: "warehouse",
      accessorKey: "warehouse.name",
      header: "Kho",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground whitespace-normal wrap-break-word">
          {getValue<string>()}
        </span>
      ),
      size: 150,
      minSize: 110,
    },
    {
      id: "supplier",
      accessorKey: "supplier",
      header: "NCC",
      cell: ({ getValue }) => {
        const supplier = getValue<SimpleSupplier | null>();
        return supplier ? (
          <span className="whitespace-normal">{supplier.name}</span>
        ) : (
          <span className="text-muted-foreground italic">Không có</span>
        );
      },
      size: 180,
      minSize: 120,
    },
    {
      id: "totalQuantity",
      accessorKey: "totalQuantity",
      header: "Số loại hàng",
      cell: ({ getValue }) => (
        <span className="block text-right tabular-nums">
          {getValue<number>()}
        </span>
      ),
      size: 100,
      minSize: 80,
    },
    {
      id: "totalAmount",
      accessorKey: "totalAmount",
      header: "Thành tiền",
      cell: ({ getValue }) => (
        <span className="block text-right tabular-nums font-medium">
          {formatDecimal(getValue<string>(), 2)} đ
        </span>
      ),
      size: 130,
      minSize: 100,
    },
    {
      id: "createdBy",
      accessorKey: "createdBy.email",
      header: "Người lập",
      cell: ({ getValue }) => (
        <span
          className="block truncate text-muted-foreground"
          title={getValue<string>()}
        >
          {getValue<string>()}
        </span>
      ),
      size: 160,
      minSize: 110,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <Badge className={getNoteStatusColorClass(row.original.status)}>
          {row.original.statusLabel}
        </Badge>
      ),
      size: 110,
      minSize: 90,
    },
    {
      id: "actions",
      header: "",
      minSize: 100,
      cell: ({ row }) => {
        const note = row.original;
        const isDraft = note.status === "draft";
        const isPosted = note.status === "posted";
        const isVoided = note.status === "voided";

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    aria-label="Thao tác"
                    disabled={isVoided}
                  >
                    <HugeiconsIcon
                      icon={MoreVerticalIcon}
                      strokeWidth={2}
                      className="size-4"
                    />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-3xs">
                {isDraft && (
                  <DropdownMenuItem onClick={() => onEdit(note)}>
                    <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} />
                    Sửa
                  </DropdownMenuItem>
                )}
                {isDraft && (
                  <DropdownMenuItem
                    variant="success"
                    onClick={() => onFinalize(note)}
                  >
                    <HugeiconsIcon
                      icon={CheckmarkBadge01Icon}
                      strokeWidth={2}
                    />
                    Chốt phiếu
                  </DropdownMenuItem>
                )}
                {isPosted && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onVoid(note)}
                  >
                    <HugeiconsIcon
                      icon={MultiplicationSignCircleIcon}
                      strokeWidth={2}
                    />
                    Hủy phiếu
                  </DropdownMenuItem>
                )}
                {isDraft && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(note)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                    Xóa phiếu nháp
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
