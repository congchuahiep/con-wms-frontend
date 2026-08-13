"use client";

import { Search01Icon, Tag02FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategories } from "@/features/material-category";

interface MaterialsFilterBarProps {
  categoryFilter: number | null;
  onCategoryChange: (id: number | null) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const ALL_VALUE = "all";

export function MaterialsFilterBar({
  categoryFilter,
  onCategoryChange,
  search,
  onSearchChange,
}: MaterialsFilterBarProps) {
  const { data: categories = [] } = useGetCategories();

  const value = categoryFilter === null ? ALL_VALUE : String(categoryFilter);

  const handleValueChange = (next: string | null) => {
    if (next === null) return;
    onCategoryChange(next === ALL_VALUE ? null : Number(next));
  };

  return (
    <div className="shrink-0 border-b px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger>
            <HugeiconsIcon icon={Tag02FreeIcons} className="text-muted-foreground" />
            <span className="text-muted-foreground">Danh mục:</span>
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>

          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value={ALL_VALUE}>Tất cả</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative w-full max-w-xs">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Tìm mã, tên vật tư..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}
