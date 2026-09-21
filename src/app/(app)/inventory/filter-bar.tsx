"use client";

import {
  Package01Icon,
  Search01Icon,
  Tag02FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MaterialCategory } from "@/features/material-category";
import { useGetCategories } from "@/features/material-category";

interface InventoryFilterBarProps {
  categoryFilter: number | null;
  onCategoryChange: (id: number | null) => void;
  stockStatus: "all" | "inStock";
  onStockStatusChange: (status: "all" | "inStock") => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const ALL_VALUE = "all";

/** Flatten tree danh mục → options với indent (cấp cha-con). */
function flattenCategories(
  nodes: MaterialCategory[],
  depth = 0,
): { id: number; label: string }[] {
  return nodes.flatMap((node) => [
    { id: node.id, label: `${"\u00A0".repeat(depth * 2)}${node.name}` },
    ...flattenCategories(node.children, depth + 1),
  ]);
}

export function InventoryFilterBar({
  categoryFilter,
  onCategoryChange,
  stockStatus,
  onStockStatusChange,
  search,
  onSearchChange,
}: InventoryFilterBarProps) {
  const { data: categories = [] } = useGetCategories();

  const categoryValue =
    categoryFilter === null ? ALL_VALUE : String(categoryFilter);

  const categoryOptions = flattenCategories(categories);

  return (
    <div className="shrink-0 border-b px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={categoryValue}
            onValueChange={(next) => {
              if (next === null) return;
              onCategoryChange(next === ALL_VALUE ? null : Number(next));
            }}
          >
            <SelectTrigger>
              <HugeiconsIcon
                icon={Tag02FreeIcons}
                className="text-purple-700"
              />
              <span className="text-muted-foreground">Danh mục:</span>
              <SelectValue placeholder="Tất cả">
                {(value) => {
                  if (value === ALL_VALUE) return "Tất cả";
                  return (
                    categoryOptions
                      .find((cat) => cat.id === Number(value))
                      ?.label.trim() ?? value
                  );
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectItem value={ALL_VALUE}>Tất cả</SelectItem>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={stockStatus}
            onValueChange={(next) => {
              if (next === null) return;
              onStockStatusChange(next === "inStock" ? "inStock" : "all");
            }}
          >
            <SelectTrigger>
              <HugeiconsIcon icon={Package01Icon} className="text-yellow-700" />
              <span className="text-muted-foreground">Tồn:</span>
              <SelectValue placeholder="Tất cả">
                {(value) => {
                  if (value === "all") return "Tất cả";
                  return value === "inStock" ? "Còn tồn (≠ 0)" : value;
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="inStock">Còn tồn (≠ 0)</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
