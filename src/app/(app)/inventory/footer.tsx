"use client";

import { formatDecimal } from "@/utils/format";

interface InventoryFooterProps {
  totalRows: number;
  totalValue: number;
}

export function InventoryFooter({
  totalRows,
  totalValue,
}: InventoryFooterProps) {
  return (
    <footer className="shrink-0 flex items-center justify-between border-t px-6 py-2">
      <p className="text-sm text-muted-foreground">{totalRows} dòng tồn kho</p>
      <p className="text-sm text-muted-foreground">
        Tổng giá trị tồn:{" "}
        <span className="font-medium tabular-nums text-foreground">
          {formatDecimal(totalValue, 2)} đ
        </span>
      </p>
    </footer>
  );
}
