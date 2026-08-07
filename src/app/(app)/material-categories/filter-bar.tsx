"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/ui/input";

interface MaterialCategoriesFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function MaterialCategoriesFilterBar({
  search,
  onSearchChange,
}: MaterialCategoriesFilterBarProps) {
  return (
    <div className="shrink-0 border-b px-3 py-2">
      <div className="relative w-full max-w-xs">
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Tìm mã, tên danh mục..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
