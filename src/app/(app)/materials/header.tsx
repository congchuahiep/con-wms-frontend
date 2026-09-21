"use client";

import { Add01Icon, Package01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/ui/export-button";
import { cn } from "@/lib/utils";

interface MaterialsHeaderProps {
  totalItems: number;
  onAdd: () => void;
  onExport: () => void;
}

export function MaterialsHeader({
  totalItems,
  onAdd,
  onExport,
}: MaterialsHeaderProps) {
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
        <h1 className="font-semibold tracking-tight">Vật tư</h1>
        <p className="text-sm text-muted-foreground">{totalItems} mặt hàng</p>
      </div>

      <div className="flex items-center gap-2">
        <ExportButton onClick={onExport} />
        <Button size="sm" onClick={onAdd}>
          <HugeiconsIcon
            icon={Add01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Thêm vật tư
        </Button>
      </div>
    </header>
  );
}
