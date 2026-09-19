"use client";
import { Add01Icon, Building02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function SitesHeader({ totalItems, onAdd }: { totalItems: number; onAdd: () => void }) {
  return (
    <header className={cn("flex shrink-0 items-center justify-between gap-4 border-b py-2 px-3")}>
      <div className="flex items-center gap-3">
        <div className={cn("flex size-7 items-center justify-center rounded-lg", "bg-accent text-accent-foreground border")}>
          <HugeiconsIcon icon={Building02Icon} strokeWidth={2} className="size-5" />
        </div>
        <h1 className="font-semibold tracking-tight">Công trường</h1>
        <p className="text-sm text-muted-foreground">{totalItems} công trường</p>
      </div>
      <Button size="sm" onClick={onAdd}><HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />Thêm công trường</Button>
    </header>
  );
}
