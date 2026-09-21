"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/ui/circle-progress";
import type { SiteRequirementRow } from "@/features/site";
import { cn } from "@/lib/utils";
import { formatDecimal } from "@/utils/format";

function RequirementStatus({
  status,
}: {
  status: SiteRequirementRow["status"];
}) {
  const config = {
    sufficient: {
      label: "Đủ",
      className: "border-emerald-500/30 text-emerald-600 bg-emerald-50",
    },
    insufficient: {
      label: "Thiếu",
      className: "border-destructive/30 text-destructive bg-destructive/5",
    },
    not_in_plan: {
      label: "Ngoài định mức",
      className: "border-border text-muted-foreground bg-muted",
    },
  }[status];
  return (
    <Badge variant="outline" className={cn("text-xs", config.className)}>
      {config.label}
    </Badge>
  );
}

const right = "text-right tabular-nums";

/** Bảng so sánh định mức vật tư vs tồn kho công trường - dùng chung DataTable. */
export function createRequirementColumns(): ColumnDef<SiteRequirementRow>[] {
  return [
    {
      id: "material",
      header: "Vật tư",
      cell: ({ row }) => (
        <span className="inline-flex items-baseline gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.material.code}
          </span>
          <span className="font-medium">{row.original.material.name}</span>
        </span>
      ),
      size: 280,
      minSize: 200,
    },
    {
      id: "compare",
      header: "Tồn kho / Định mức",
      cell: ({ row }) => {
        // Luôn tính từ chuỗi thập phân gốc của backend ("1340.630"),
        // KHÔNG parse lại chuỗi đã format vi-VN ("1.340,63") — sẽ sai trị số.
        const balance = Number(row.original.balance);
        const requiredQuantity = row.original.requiredQuantity
          ? Number(row.original.requiredQuantity)
          : 0;

        const isExcessQuota = row.original.requiredQuantity
          ? balance > requiredQuantity
          : true;

        const progress =
          requiredQuantity > 0
            ? Math.round((balance / requiredQuantity) * 100)
            : 0;

        return (
          <div className={cn("flex items-center justify-between gap-3")}>
            <div className={right}>
              <span
                className={cn(
                  "text-muted-foreground",
                  isExcessQuota && "text-green-700",
                )}
              >
                {formatDecimal(balance)}
              </span>
              {requiredQuantity !== 0 && (
                <>
                  <span>/</span>
                  <span className="text-foreground font-medium">
                    {formatDecimal(requiredQuantity)}
                  </span>
                </>
              )}
            </div>

            <CircularProgress
              value={Math.min(progress, 100)}
              size={30}
              className={cn("text-xs", requiredQuantity === 0 && "invisible")}
            >
              {progress}%
            </CircularProgress>
          </div>
        );
      },
      size: 200,
      minSize: 120,
    },
    {
      id: "unit",
      header: "Đơn vị",
      accessorFn: (row) => row.material.unit,
      cell: ({ getValue }) => (
        <span className="text-right text-muted-foreground">
          {getValue<string>()}
        </span>
      ),
      size: 80,
      minSize: 70,
    },
    {
      id: "status",
      header: "Trạng thái",
      accessorFn: (row) => row.status,
      cell: ({ getValue }) => {
        return (
          <div className="flex justify-end">
            <RequirementStatus
              status={getValue<SiteRequirementRow["status"]>()}
            />
          </div>
        );
      },
      size: 124,
      minSize: 120,
    },
    {
      id: "defaultReturnQuantity",
      header: "Trả về khi tất toán",
      accessorFn: (row) => row.defaultReturnQuantity,
      cell: ({ row }) => {
        const quantity = row.original.defaultReturnQuantity;
        return (
          <div className="text-right">
            {Number(quantity) > 0 ? (
              <span className="font-medium tabular-nums">
                + {formatDecimal(quantity)}
              </span>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
            {row.original.note ? (
              <span className="block text-xs text-muted-foreground">
                {row.original.note}
              </span>
            ) : null}
          </div>
        );
      },
      size: 170,
      minSize: 140,
    },
  ];
}
