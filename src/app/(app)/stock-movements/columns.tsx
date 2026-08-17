"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  getMovementTypeColorClass,
  type StockMovement,
} from "@/features/stock";
import { cn } from "@/lib/utils";
import { formatDate, formatDateTime, formatDecimal } from "@/utils/format";

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
    size: 150,
    minSize: 120,
  },
  {
    id: "materialCode",
    accessorKey: "material.code",
    header: "Mã vật tư",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue<string>()}</span>
    ),
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
      <span className="text-muted-foreground">{getValue<string>()}</span>
    ),
    size: 150,
    minSize: 110,
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: "Số lượng",
    cell: ({ getValue }) => {
      const quantity = getValue<string>();
      const value = Number(quantity);
      return (
        <span
          className={cn(
            "block text-right tabular-nums font-medium",
            value > 0 && "text-emerald-600",
            value < 0 && "text-destructive",
          )}
        >
          {value > 0 ? `+${formatDecimal(quantity)}` : formatDecimal(quantity)}
        </span>
      );
    },
    size: 110,
    minSize: 90,
  },
  {
    id: "unitPrice",
    accessorKey: "unitPrice",
    header: "Đơn giá",
    cell: ({ getValue }) => (
      <span className="block text-right tabular-nums">
        {formatDecimal(getValue<string | null>(), 2)}
      </span>
    ),
    size: 120,
    minSize: 100,
  },
  {
    id: "inboundNote",
    accessorKey: "inboundNote.number",
    header: "Phiếu",
    cell: ({ getValue }) => {
      const number = getValue<string | null>();
      return number ? (
        <span className="font-mono text-xs">{number}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
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
      if (!reason) return <span className="text-muted-foreground">—</span>;
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
    size: 140,
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
    header: "Thời điểm",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground tabular-nums">
        {formatDateTime(getValue<string>())}
      </span>
    ),
    minSize: 140,
  },
];
