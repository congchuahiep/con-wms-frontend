"use client";

import { Search01Icon, Tag02FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MaterialCategory } from "@/features/material-category";
import {
  getCategoryColorClass,
  useGetCategories,
} from "@/features/material-category";
import { cn } from "@/lib/utils";

interface MaterialsFilterBarProps {
  categoryFilter: number | null;
  onCategoryChange: (id: number | null) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const ALL_VALUE = "all";

interface CategoryOption {
  value: string;
  label: string;
  color: string | null;
  depth: number;
}

/** Flatten cây danh mục → danh sách phẳng kèm depth (giống CategorySelectField). */
function flattenCategories(
  nodes: MaterialCategory[],
  depth = 0,
): CategoryOption[] {
  return nodes.flatMap((node) => [
    { value: String(node.id), label: node.name, color: node.color, depth },
    ...flattenCategories(node.children, depth + 1),
  ]);
}

export function MaterialsFilterBar({
  categoryFilter,
  onCategoryChange,
  search,
  onSearchChange,
}: MaterialsFilterBarProps) {
  const { data: categories = [] } = useGetCategories();

  const categoryOptions = useMemo(
    () => flattenCategories(categories),
    [categories],
  );

  const value = categoryFilter === null ? ALL_VALUE : String(categoryFilter);

  const handleValueChange = (next: string | null) => {
    if (next === null) return;
    onCategoryChange(next === ALL_VALUE ? null : Number(next));
  };

  const renderSelectedValue = (selected: string | null) => {
    if (!selected || selected === ALL_VALUE) return "Tất cả";
    return (
      categoryOptions.find((option) => option.value === selected)?.label ??
      selected
    );
  };

  return (
    <div className="shrink-0 border-b px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select value={value} onValueChange={handleValueChange}>
          <SelectTrigger>
            <HugeiconsIcon
              icon={Tag02FreeIcons}
              className="text-muted-foreground"
            />
            <span className="text-muted-foreground">Danh mục:</span>
            <SelectValue placeholder="Tất cả">
              {renderSelectedValue}
            </SelectValue>
          </SelectTrigger>

          <SelectContent
            alignItemWithTrigger={false}
            align="start"
            className="w-3xs"
          >
            <SelectItem value={ALL_VALUE}>Tất cả</SelectItem>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span
                  className="flex items-center gap-2"
                  style={{ paddingLeft: `${option.depth * 20}px` }}
                >
                  <span
                    className={cn(
                      "inline-block rounded-full shrink-0 border",
                      "size-2.5",
                      getCategoryColorClass(option.color),
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </span>
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
