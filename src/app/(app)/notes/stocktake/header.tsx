"use client";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/ui/export-button";
import { cn } from "@/lib/utils";
import { NoteStatusTabs } from "../_components/note-status-tabs";

interface StocktakeNotesHeaderProps {
  total: number;
  onAdd: () => void;
  onExport: () => void;
}

export function StocktakeNotesHeader({
  total,
  onAdd,
  onExport,
}: StocktakeNotesHeaderProps) {
  return (
    <header
      className={cn(
        "flex shrink-0 items-center justify-between gap-4 border-b py-1 px-1",
      )}
    >
      <div className="flex items-center gap-3">
        <NoteStatusTabs noteType="stocktake" />
        <p className="text-sm text-muted-foreground">{total} phiếu</p>
      </div>

      <div className="flex items-center gap-2">
        <ExportButton onClick={onExport} />
        <Button onClick={onAdd}>
          <HugeiconsIcon
            icon={Add01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Tạo phiếu kiểm kê
        </Button>
      </div>
    </header>
  );
}
