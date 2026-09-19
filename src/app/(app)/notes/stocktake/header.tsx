"use client";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NoteStatusTabs } from "../_components/note-status-tabs";

interface StocktakeNotesHeaderProps {
  total: number;
  onAdd: () => void;
}

export function StocktakeNotesHeader({
  total,
  onAdd,
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

      <Button onClick={onAdd}>
        <HugeiconsIcon
          icon={Add01Icon}
          strokeWidth={2}
          data-icon="inline-start"
        />
        Tạo phiếu kiểm kê
      </Button>
    </header>
  );
}
