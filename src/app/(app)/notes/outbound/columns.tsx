"use client";

import {
  CheckmarkBadge01Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  Delete02Icon,
  MoreVerticalIcon,
  MultiplicationSignCircleIcon,
  PencilEdit01Icon,
  PrinterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { OutboundNote } from "@/features/outbound-note";
import { formatDate } from "@/utils/format";

interface ColumnsOptions {
  onEdit: (note: OutboundNote) => void;
  onDelete: (note: OutboundNote) => void;
  onFinalize: (note: OutboundNote) => void;
  onVoid: (note: OutboundNote) => void;
  onPrint: (note: OutboundNote) => void;
}

export function createColumns({
  onEdit,
  onDelete,
  onFinalize,
  onVoid,
  onPrint,
}: ColumnsOptions): ColumnDef<OutboundNote>[] {
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
      size: 170,
      minSize: 140,
    },
    {
      id: "date",
      accessorKey: "date",
      header: "Ngày",
      cell: ({ getValue }) => (
        <span className="italic">{formatDate(getValue<string>())}</span>
      ),
      size: 120,
      minSize: 120,
    },
    {
      id: "noteType",
      accessorKey: "noteTypeLabel",
      header: "Loại",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground whitespace-normal wrap-break-word">
          {getValue<string>()}
        </span>
      ),
      size: 130,
      minSize: 100,
    },
    {
      id: "warehouse",
      accessorKey: "warehouse.name",
      header: "Kho xuất",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground whitespace-normal wrap-break-word">
          {getValue<string>()}
        </span>
      ),
      size: 150,
      minSize: 110,
    },
    {
      id: "destination",
      header: "Đích/Công trường",
      cell: ({ row }) => {
        const note = row.original;
        if (note.toWarehouse) {
          return (
            <span className="whitespace-normal">{note.toWarehouse.name}</span>
          );
        }
        if (note.site) {
          return <span className="whitespace-normal">{note.site.name}</span>;
        }
        return <span className="text-muted-foreground italic">—</span>;
      },
      size: 180,
      minSize: 120,
    },
    {
      id: "totalQuantity",
      accessorKey: "totalQuantity",
      header: "SL",
      cell: ({ getValue }) => (
        <span className="block text-right tabular-nums">
          {getValue<number>()}
        </span>
      ),
      size: 90,
      minSize: 80,
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
      id: "actions",
      header: "",
      minSize: 60,
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
                <DropdownMenuItem onClick={() => onPrint(note)}>
                  <HugeiconsIcon icon={PrinterIcon} strokeWidth={2} />
                  In phiếu
                </DropdownMenuItem>
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
