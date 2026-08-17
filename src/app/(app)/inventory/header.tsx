"use client";

import {
  Add01Icon,
  Download01Icon,
  Package01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDecimal } from "@/utils/format";

interface InventoryHeaderProps {
  totalRows: number;
  totalValue: number;
}

export function InventoryHeader({
  totalRows,
  totalValue,
}: InventoryHeaderProps) {
  return (
    <header
      className={cn(
        "flex shrink-0 items-center justify-between gap-4 border-b py-2 px-3",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-7 items-center justify-center rounded-lg",
            "bg-accent text-accent-foreground border",
          )}
        >
          <HugeiconsIcon
            icon={Package01Icon}
            strokeWidth={2}
            className="size-5"
          />
        </div>
        <h1 className="font-semibold tracking-tight">Tồn kho</h1>
        <p className="text-sm text-muted-foreground">
          {totalRows} dòng tồn kho &middot; {formatDecimal(totalValue, 2)} đ
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <HugeiconsIcon
            icon={Download01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Xuất CSV
        </Button>
        <Button
          size="sm"
          nativeButton={false}
          render={
            <Link
              href="/inbound-notes"
              className="inline-flex items-center gap-1.5"
            />
          }
        >
          <HugeiconsIcon
            icon={Add01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Lập phiếu nhập
        </Button>
      </div>
    </header>
  );
}
