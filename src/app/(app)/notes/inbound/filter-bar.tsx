"use client";

import {
  ArrowRight01Icon,
  NoteIcon,
  Search01Icon,
  TruckIcon,
  WarehouseIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { InboundNoteType } from "@/features/inbound-note";
import { useGetSuppliers } from "@/features/supplier";
import { useGetWarehouses } from "@/features/warehouse";

interface InboundNotesFilterBarProps {
  noteTypeFilter?: InboundNoteType;
  onNoteTypeChange: (type?: InboundNoteType) => void;
  warehouseFilter?: number;
  onWarehouseChange: (id?: number) => void;
  supplierFilter?: number;
  onSupplierChange: (id?: number) => void;
  dateFrom: string;
  onDateFromChange: (date?: string) => void;
  dateTo: string;
  onDateToChange: (date?: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const ALL_VALUE = "all";

const NOTE_TYPE_OPTIONS: {
  value: InboundNoteType | typeof ALL_VALUE;
  label: string;
}[] = [
  { value: ALL_VALUE, label: "Tất cả" },
  { value: "purchase", label: "Mua hàng từ nhà cung cấp" },
  { value: "return_from_site", label: "Công trường trả lại hàng" },
];

export function InboundNotesFilterBar({
  noteTypeFilter,
  onNoteTypeChange,
  warehouseFilter,
  onWarehouseChange,
  supplierFilter,
  onSupplierChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  search,
  onSearchChange,
}: InboundNotesFilterBarProps) {
  const { data: warehouses = [] } = useGetWarehouses();
  const { data: suppliers = [] } = useGetSuppliers();

  return (
    <div className="border-b px-1 py-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            items={NOTE_TYPE_OPTIONS}
            value={noteTypeFilter ?? ALL_VALUE}
            onValueChange={(next) => {
              if (next === null) return;
              onNoteTypeChange(
                next === ALL_VALUE ? undefined : (next as InboundNoteType),
              );
            }}
          >
            <SelectTrigger>
              <HugeiconsIcon
                icon={NoteIcon}
                className="text-yellow-700"
                strokeWidth={2}
              />
              <span className="text-muted-foreground">Loại:</span>
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>

            <SelectContent alignItemWithTrigger={false} className="w-3xs">
              {NOTE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              warehouseFilter === undefined
                ? ALL_VALUE
                : String(warehouseFilter)
            }
            onValueChange={(next) => {
              if (next === null) return;
              onWarehouseChange(next === ALL_VALUE ? undefined : Number(next));
            }}
          >
            <SelectTrigger>
              <HugeiconsIcon icon={WarehouseIcon} className="text-red-700" />
              <span className="text-muted-foreground">Kho:</span>
              <SelectValue placeholder="Tất cả">
                {(value: string) => {
                  if (value === ALL_VALUE) return "Tất cả";

                  return (
                    warehouses.find((w) => String(w.id) === value)?.name ??
                    value
                  );
                }}
              </SelectValue>
            </SelectTrigger>

            <SelectContent alignItemWithTrigger={false} className="w-3xs">
              <SelectItem value={ALL_VALUE}>Tất cả kho</SelectItem>

              {warehouses.map((warehouse) => (
                <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              supplierFilter === undefined ? ALL_VALUE : String(supplierFilter)
            }
            onValueChange={(next) => {
              if (next === null) return;
              onSupplierChange(next === ALL_VALUE ? undefined : Number(next));
            }}
          >
            <SelectTrigger>
              <HugeiconsIcon icon={TruckIcon} className="text-blue-700" />
              <span className="text-muted-foreground">NCC:</span>
              <SelectValue placeholder="Tất cả">
                {(value: string) => {
                  if (value === ALL_VALUE) return "Tất cả";

                  return (
                    suppliers.find((s) => String(s.id) === value)?.name ?? value
                  );
                }}
              </SelectValue>
            </SelectTrigger>

            <SelectContent alignItemWithTrigger={false} className="w-3xs">
              <SelectItem value={ALL_VALUE}>Tất cả</SelectItem>

              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={String(supplier.id)}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="w-px h-8 mx-1" />

          <ButtonGroup>
            <DatePicker
              value={dateFrom || null}
              onChange={(date) => onDateFromChange(date ?? undefined)}
              placeholder="Từ ngày"
            />

            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={ArrowRight01Icon} />
            </Button>

            <DatePicker
              value={dateTo || null}
              onChange={(date) => onDateToChange(date ?? undefined)}
              placeholder="Đến ngày"
            />
          </ButtonGroup>
        </div>

        <div className="relative w-full max-w-xs">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Tìm số phiếu..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}
