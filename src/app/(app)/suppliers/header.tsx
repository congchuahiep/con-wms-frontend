"use client";

import { Add01Icon, TruckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SuppliersHeaderProps {
  totalItems: number;
  onAdd: () => void;
}

export function SuppliersHeader({ totalItems, onAdd }: SuppliersHeaderProps) {
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
          <HugeiconsIcon icon={TruckIcon} strokeWidth={2} className="size-5" />
        </div>
        <h1 className="font-semibold tracking-tight">Nhà cung cấp</h1>
        <p className="text-sm text-muted-foreground">
          {totalItems} nhà cung cấp
        </p>
      </div>

      <Button size="sm" onClick={onAdd}>
        <HugeiconsIcon
          icon={Add01Icon}
          strokeWidth={2}
          data-icon="inline-start"
        />
        Thêm nhà cung cấp
      </Button>
    </header>
  );
}
