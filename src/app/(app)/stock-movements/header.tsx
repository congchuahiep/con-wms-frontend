"use client";

import { Book01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StockMovementsHeaderProps {
  total: number;
}

export function StockMovementsHeader({ total }: StockMovementsHeaderProps) {
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
          <HugeiconsIcon icon={Book01Icon} strokeWidth={2} className="size-5" />
        </div>
        <h1 className="font-semibold tracking-tight">Sổ kho</h1>
        <p className="text-sm text-muted-foreground">{total} dòng ghi sổ</p>
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
      </div>
    </header>
  );
}
