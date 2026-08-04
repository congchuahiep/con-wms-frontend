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
import { materialCategories } from "@/lib/mock/data";

interface MaterialsFilterBarProps {
  activeCategory: number | null;
  onCategoryChange: (id: number | null) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const ALL_VALUE = "all";

export function MaterialsFilterBar({
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
}: MaterialsFilterBarProps) {
  const value = activeCategory === null ? ALL_VALUE : String(activeCategory);

  const handleValueChange = (next: string | null) => {
    if (next === null) return;
    onCategoryChange(next === ALL_VALUE ? null : Number(next));
  };

  const selectedLabel = (selectValue: string | null) => {
    if (selectValue === null || selectValue === ALL_VALUE) {
      return "Tất cả";
    }
    const cat = materialCategories.find((c) => String(c.id) === selectValue);
    return cat?.name ?? selectValue;
  };

  return (
    <div className="shrink-0 border-b px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger>
            <HugeiconsIcon icon={Tag02FreeIcons} className="text-red-600" />
            <span className="text-muted-foreground">Danh mục:</span>
            <SelectValue>{selectedLabel}</SelectValue>
          </SelectTrigger>

          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value={ALL_VALUE}>Tất cả</SelectItem>
            {materialCategories.map((cat) => (
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
            placeholder="Tìm vật tư, SKU..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}
