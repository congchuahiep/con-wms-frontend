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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { StocktakeNote } from "@/features/stocktake";
import { formatDate } from "@/utils/format";

interface ColumnsOptions {
  onEdit: (note: StocktakeNote) => void;
  onDelete: (note: StocktakeNote) => void;
  onFinalize: (note: StocktakeNote) => void;
  onVoid: (note: StocktakeNote) => void;
}

export function createColumns({
  onEdit,
  onDelete,
  onFinalize,
  onVoid,
}: ColumnsOptions): ColumnDef<StocktakeNote>[] {
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
      id: "totalQuantity",
      accessorKey: "totalQuantity",
      header: "SL điều chỉnh",
      cell: ({ getValue }) => (
        <span className="block text-right tabular-nums">
          {getValue<number>()}
        </span>
      ),
      size: 120,
      minSize: 120,
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
