"use client";

import {
  Building02Icon,
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
import { useGetWarehouses } from "@/features/warehouse";

interface InventoryFilterBarProps {
  categoryFilter: number | null;
  onCategoryChange: (id: number | null) => void;
  warehouseFilter: number | null;
  onWarehouseChange: (id: number | null) => void;
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
  warehouseFilter,
  onWarehouseChange,
  stockStatus,
  onStockStatusChange,
  search,
  onSearchChange,
}: InventoryFilterBarProps) {
  const { data: categories = [] } = useGetCategories();
  const { data: warehouses = [] } = useGetWarehouses();

  const categoryValue =
    categoryFilter === null ? ALL_VALUE : String(categoryFilter);
  const warehouseValue =
    warehouseFilter === null ? ALL_VALUE : String(warehouseFilter);

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
                className="text-muted-foreground"
              />
              <span className="text-muted-foreground">Danh mục:</span>
              <SelectValue placeholder="Tất cả" />
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
            value={warehouseValue}
            onValueChange={(next) => {
              if (next === null) return;
              onWarehouseChange(next === ALL_VALUE ? null : Number(next));
            }}
          >
            <SelectTrigger>
              <HugeiconsIcon
                icon={Building02Icon}
                className="text-muted-foreground"
              />
              <span className="text-muted-foreground">Kho:</span>
              <SelectValue placeholder="Tất cả kho" />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectItem value={ALL_VALUE}>Tất cả kho</SelectItem>
              {warehouses.map((warehouse) => (
                <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                  {warehouse.name}
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
              <HugeiconsIcon
                icon={Package01Icon}
                className="text-muted-foreground"
              />
              <span className="text-muted-foreground">Tồn:</span>
              <SelectValue placeholder="Tất cả" />
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
