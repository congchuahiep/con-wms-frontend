"use client";

import {
  ArrowRight01Icon,
  Exchange01Icon,
  WarehouseIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MaterialCombobox } from "@/features/material";
import {
  MOVEMENT_TYPE_LABEL_MAP,
  MOVEMENT_TYPES,
  type MovementType,
} from "@/features/stock";
import { useGetWarehouses } from "@/features/warehouse";

interface StockMovementsFilterBarProps {
  warehouseFilter: number | null;
  onWarehouseChange: (id: number | null) => void;
  movementTypeFilter: MovementType | null;
  onMovementTypeChange: (type: MovementType | null) => void;
  materialFilter: number | null;
  onMaterialChange: (id: number | null) => void;
  dateFrom: string;
  onDateFromChange: (date: string | null) => void;
  dateTo: string;
  onDateToChange: (date: string | null) => void;
  showReversals: boolean;
  onShowReversalsChange: (show: boolean) => void;
}

const ALL_VALUE = "all";

export function StockMovementsFilterBar({
  warehouseFilter,
  onWarehouseChange,
  movementTypeFilter,
  onMovementTypeChange,
  materialFilter,
  onMaterialChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  showReversals,
  onShowReversalsChange,
}: StockMovementsFilterBarProps) {
  const { data: warehouses = [] } = useGetWarehouses({ includeSite: true });

  return (
    <div className="shrink-0 border-b px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={
              warehouseFilter === null ? ALL_VALUE : String(warehouseFilter)
            }
            onValueChange={(next) => {
              if (next === null) return;
              onWarehouseChange(next === ALL_VALUE ? null : Number(next));
            }}
          >
            <SelectTrigger>
              <HugeiconsIcon icon={WarehouseIcon} className="text-red-700" />
              <span className="text-muted-foreground">Kho:</span>
              <SelectValue placeholder="Tất cả kho">
                {(value: string) => {
                  if (value === ALL_VALUE) return "Tất cả";

                  return (
                    warehouses.find((w) => String(w.id) === value)?.name ??
                    value
                  );
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="w-2xs">
              <SelectItem value={ALL_VALUE}>Tất cả kho</SelectItem>
              {warehouses.map((warehouse) => (
                <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={movementTypeFilter ?? ALL_VALUE}
            onValueChange={(next) => {
              if (next === null) return;
              onMovementTypeChange(
                next === ALL_VALUE ? null : (next as MovementType),
              );
            }}
          >
            <SelectTrigger>
              <HugeiconsIcon icon={Exchange01Icon} className="text-green-700" />
              <span className="text-muted-foreground">Loại dòng:</span>
              <SelectValue placeholder="Tất cả">
                {(value: MovementType | typeof ALL_VALUE) => {
                  if (value === ALL_VALUE) return "Tất cả";
                  return MOVEMENT_TYPE_LABEL_MAP[value];
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="w-2xs">
              <SelectItem value={ALL_VALUE}>Tất cả</SelectItem>
              {MOVEMENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {MOVEMENT_TYPE_LABEL_MAP[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ButtonGroup>
            <DatePicker
              value={dateFrom || null}
              onChange={onDateFromChange}
              placeholder="Từ ngày"
            />
            <Button variant="muted" size="icon">
              <HugeiconsIcon icon={ArrowRight01Icon} />
            </Button>
            <DatePicker
              value={dateTo || null}
              onChange={onDateToChange}
              placeholder="Đến ngày"
            />
          </ButtonGroup>

          <div className="flex items-center gap-2 text-sm text-muted-foreground select-none">
            <Switch
              checked={showReversals}
              onCheckedChange={onShowReversalsChange}
            />
            Hiện dòng hủy
          </div>
        </div>

        <div className="w-full max-w-xs">
          <MaterialCombobox
            value={materialFilter}
            onChange={onMaterialChange}
            placeholder="Tìm vật tư (mã hoặc tên)..."
          />
        </div>
      </div>
    </div>
  );
}
