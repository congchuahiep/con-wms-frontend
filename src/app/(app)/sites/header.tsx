"use client";

import { Add01Icon, ConstructionIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SitesHeaderProps {
  totalItems: number;
  onAdd: () => void;
  /** Chỉ admin mới được tạo/sửa công trường (backend IsAdmin). */
  canCreate?: boolean;
}

export function SitesHeader({
  totalItems,
  onAdd,
  canCreate = true,
}: SitesHeaderProps) {
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
            icon={ConstructionIcon}
            strokeWidth={2}
            className="size-5"
          />
        </div>
        <h1 className="font-semibold tracking-tight">Công trường</h1>
        <p className="text-sm text-muted-foreground">
          {totalItems} công trường
        </p>
      </div>

      {canCreate && (
        <Button size="sm" onClick={onAdd}>
          <HugeiconsIcon
            icon={Add01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Thêm công trường
        </Button>
      )}
    </header>
  );
}
