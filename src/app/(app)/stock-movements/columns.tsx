"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  getMovementTypeColorClass,
  type SourceNoteRef,
  type SourceNoteType,
  type StockMovement,
} from "@/features/stock";
import { cn } from "@/lib/utils";
import {
  formatDate,
  formatDateTime,
  formatDecimal,
  formatMoney,
} from "@/utils/format";

/** URL cơ bản của 3 nhóm trang phiếu — đồng bộ `SourceNoteType`. */
const SOURCE_NOTE_PATH: Record<SourceNoteType, string> = {
  inbound: "/notes/inbound",
  outbound: "/notes/outbound",
  stocktake: "/notes/stocktake",
};

/**
 * Link từ số phiếu trên sổ kho → trang phiếu tương ứng, search sẵn bằng mã phiếu.
 * Dòng reversal (`reversalOf != null`) là phiếu đã HỦY → kèm `status=voided`
 * để trang phiếu mặc định "Đã chốt" không bỏ sót.
 */
function sourceNoteHref(sourceNote: SourceNoteRef, voided: boolean): string {
  const params = new URLSearchParams({
    search: sourceNote.number,
    ...(voided ? { status: "voided" } : {}),
  });
  return `${SOURCE_NOTE_PATH[sourceNote.noteType]}?${params.toString()}`;
}

export const columns: ColumnDef<StockMovement>[] = [
  {
    id: "date",
    accessorKey: "date",
    header: "Ngày",
    cell: ({ getValue }) => (
      <span className="tabular-nums">{formatDate(getValue<string>())}</span>
    ),
    size: 100,
    minSize: 90,
  },
  {
    id: "movementType",
    accessorKey: "movementType",
    header: "Loại",
    cell: ({ row }) => (
      <Badge className={getMovementTypeColorClass(row.original.movementType)}>
        {row.original.movementTypeLabel}
      </Badge>
    ),
    size: 250,
    minSize: 250,
  },
  {
    id: "materialCode",
    accessorKey: "material.code",
    header: "Mã vật tư",
    cell: ({ getValue }) => <code>{getValue<string>()}</code>,
    size: 110,
    minSize: 90,
  },
  {
    id: "materialName",
    accessorKey: "material.name",
    header: "Tên vật tư",
    cell: ({ getValue }) => <span>{getValue<string>()}</span>,
    size: 200,
    minSize: 140,
  },
  {
    id: "warehouse",
    accessorKey: "warehouse.name",
    header: "Kho",
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <span className="text-muted-foreground truncate">
          {getValue<string>()}
        </span>
      </div>
    ),
    size: 150,
    minSize: 110,
  },
  {
    id: "unitPrice",
    accessorKey: "unitPrice",
    header: "Đơn giá",
    cell: ({ getValue }) => (
      <span className="block text-right tabular-nums">
        {formatMoney(getValue<string | null>(), 2)}
      </span>
    ),
    size: 120,
    minSize: 100,
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: "Số lượng",
    cell: ({ getValue, row }) => {
      const quantity = getValue<string>();
      const value = Number(quantity);
      return (
        <div className="flex items-center gap-1 justify-end">
          <div
            className={cn(
              "block tabular-nums font-medium",
              value > 0 && "text-emerald-600",
              value < 0 && "text-destructive",
            )}
          >
            {value > 0
              ? `+${formatDecimal(quantity)}`
              : formatDecimal(quantity)}{" "}
          </div>
          <div className="text-muted-foreground font-normal text-xs w-8">
            {row.original.material.unit}
          </div>
        </div>
      );
    },
    size: 150,
    minSize: 90,
  },
  {
    id: "amount",
    accessorFn: (row) =>
      row.unitPrice === null
        ? null
        : Number(row.quantity) * Number(row.unitPrice),
    header: "Thành tiền",
    cell: ({ row }) => {
      const { quantity, unitPrice } = row.original;
      if (unitPrice === null)
        return (
          <span className="block text-right tabular-nums text-muted-foreground">
            —
          </span>
        );
      const amount = Number(quantity) * Number(unitPrice);
      return (
        <span
          className={cn(
            "block text-right tabular-nums font-medium",
            amount > 0 && "text-emerald-600",
            amount < 0 && "text-destructive",
          )}
        >
          {formatMoney(amount, 2)}
        </span>
      );
    },
    size: 160,
    minSize: 110,
  },
  {
    id: "sourceNote",
    accessorKey: "sourceNote.number",
    header: "Phiếu",
    cell: ({ row }) => {
      const { sourceNote, reversalOf } = row.original;
      if (!sourceNote) return <span className="text-muted-foreground">-</span>;
      return (
        <Link
          href={sourceNoteHref(sourceNote, reversalOf !== null)}
          title={`Mở ${sourceNote.number}`}
          className="inline-flex items-center gap-1.5 hover:underline"
        >
          <code className="text-blue-800">{sourceNote.number}</code>
        </Link>
      );
    },
    size: 170,
    minSize: 130,
  },
  {
    id: "reason",
    accessorKey: "reason",
    header: "Lý do",
    cell: ({ row }) => {
      const { reason, reversalOf } = row.original;
      if (!reason) return <span className="text-muted-foreground">-</span>;
      return (
        <div className="flex items-center gap-1.5">
          {reversalOf !== null && (
            <Badge variant="destructive" className="shrink-0 text-[0.65rem]">
              Hủy
            </Badge>
          )}
          <span className="truncate text-muted-foreground" title={reason}>
            {reason}
          </span>
        </div>
      );
    },
    size: 320,
    minSize: 100,
  },
  {
    id: "createdBy",
    accessorKey: "createdBy.email",
    header: "Người tạo",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue<string>()}</span>
    ),
    size: 160,
    minSize: 110,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Thời điểm tạo",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground tabular-nums">
        {formatDateTime(getValue<string>())}
      </span>
    ),
    minSize: 140,
  },
];
