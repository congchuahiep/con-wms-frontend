"use client";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/ui/input";
export function SitesFilterBar({ search, onSearchChange }: { search: string; onSearchChange: (v: string) => void }) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b px-3 py-2">
      <div className="relative flex-1 max-w-sm">
        <HugeiconsIcon icon={Search01Icon} className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Tìm mã/tên công trường..." value={search} onChange={(e) => onSearchChange(e.target.value)} className="pl-8" />
      </div>
    </div>
  );
}
