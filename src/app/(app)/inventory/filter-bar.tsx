"use client";

import { Search01Icon, Tag02FreeIcons, Building02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { materialCategories, warehouses } from "@/lib/mock/data";

interface InventoryFilterBarProps {
  activeCategory: number | null;
  onCategoryChange: (id: number | null) => void;
  activeWarehouse: number | null;
  onWarehouseChange: (id: number | null) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const ALL_VALUE = "all";

export function InventoryFilterBar({
  activeCategory,
  onCategoryChange,
  activeWarehouse,
  onWarehouseChange,
  search,
  onSearchChange,
}: InventoryFilterBarProps) {
  const categoryValue = activeCategory === null ? ALL_VALUE : String(activeCategory);
  const warehouseValue = activeWarehouse === null ? ALL_VALUE : String(activeWarehouse);

  const handleCategoryChange = (next: string | null) => {
    if (next === null) return;
    onCategoryChange(next === ALL_VALUE ? null : Number(next));
  };

  const handleWarehouseChange = (next: string | null) => {
    if (next === null) return;
    onWarehouseChange(next === ALL_VALUE ? null : Number(next));
  };

  const selectedCategoryLabel = (value: string) => {
    if (value === ALL_VALUE) return "Tất cả";
    const cat = materialCategories.find((c) => String(c.id) === value);
    return cat?.name ?? value;
  };

  const selectedWarehouseLabel = (value: string) => {
    if (value === ALL_VALUE) return "Tất cả kho";
    const wh = warehouses.find((w) => String(w.id) === value);
    return wh?.name ?? value;
  };

  return (
    <div className="shrink-0 border-b px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={categoryValue} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <HugeiconsIcon icon={Tag02FreeIcons} className="text-red-600" />
              <span className="text-muted-foreground">Danh mục:</span>
              <SelectValue>{selectedCategoryLabel(categoryValue)}</SelectValue>
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

          <Select value={warehouseValue} onValueChange={handleWarehouseChange}>
            <SelectTrigger>
              <HugeiconsIcon icon={Building02Icon} className="text-blue-600" />
              <span className="text-muted-foreground">Kho:</span>
              <SelectValue>{selectedWarehouseLabel(warehouseValue)}</SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectItem value={ALL_VALUE}>Tất cả kho</SelectItem>
              {warehouses.map((wh) => (
                <SelectItem key={wh.id} value={String(wh.id)}>
                  {wh.name}
                </SelectItem>
              ))}
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
