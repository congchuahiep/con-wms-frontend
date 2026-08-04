"use client";

import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  Building02Icon,
  Calendar01Icon,
  File01Icon,
  Location01Icon,
  Package01Icon,
  PinLocation01Icon,
  Tag02FreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataTable } from "@/hooks/use-data-table";
import {
  getWarehouseById,
  getWarehouseInventory,
  materialCategories,
  type InventoryRow,
} from "@/lib/mock/data";
import { cn } from "@/lib/utils";

const LOW_STOCK_THRESHOLD = 50;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const inventoryColumns: ColumnDef<InventoryRow>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên vật tư",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Danh mục",
    cell: ({ getValue }) => (
      <Badge variant="secondary" className="text-xs">
        {getValue<string>()}
      </Badge>
    ),
  },
  {
    accessorKey: "unit",
    header: "Đơn vị",
  },
  {
    accessorKey: "location",
    header: "Vị trí",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Tồn kho",
    cell: ({ getValue }) => {
      const qty = getValue<number>();
      return (
        <span
          className={cn(
            "text-right tabular-nums font-medium",
            qty < LOW_STOCK_THRESHOLD && "text-destructive",
          )}
        >
          {qty.toLocaleString("vi-VN")}
        </span>
      );
    },
  },
];

export default function WarehouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const warehouseId = Number(params.id);
  const [infoOpen, setInfoOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const warehouse = useMemo(() => getWarehouseById(warehouseId), [warehouseId]);
  const baseInventory = useMemo(
    () => (warehouse ? getWarehouseInventory(warehouse.id) : []),
    [warehouse],
  );

  const filteredInventory = useMemo(() => {
    if (activeCategory === null) return baseInventory;
    const cat = materialCategories.find((c) => c.id === activeCategory);
    if (!cat) return baseInventory;
    const childNames = new Set(cat.children.map((ch) => ch.name));
    return baseInventory.filter((item) => childNames.has(item.category));
  }, [baseInventory, activeCategory]);

  const { table, globalFilter, setGlobalFilter } = useDataTable({
    data: filteredInventory,
    columns: inventoryColumns,
    pageSize: 25,
  });

  if (!warehouse) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Không tìm thấy kho</p>
        <Button onClick={() => router.push("/warehouses")}>
          Quay lại danh sách kho
        </Button>
      </div>
    );
  }

  const lowStockCount = baseInventory.filter(
    (item) => item.quantity < LOW_STOCK_THRESHOLD,
  ).length;
  const uniqueCategories = new Set(baseInventory.map((item) => item.category))
    .size;

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-4 border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/warehouses"
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-5" />
          </Link>
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon
              icon={Building02Icon}
              strokeWidth={2}
              className="size-5"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">
                {warehouse.name}
              </h1>
              <Badge
                variant={warehouse.isActive ? "default" : "secondary"}
                className="text-xs"
              >
                {warehouse.isActive ? "Hoạt động" : "Ngừng sử dụng"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {warehouse.code} &middot; {warehouse.address}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Chỉnh sửa
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Collapsible warehouse info */}
        <Card className="mb-6">
          <button
            type="button"
            onClick={() => setInfoOpen((v) => !v)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <HugeiconsIcon
                icon={Building02Icon}
                strokeWidth={2}
                className="size-4 text-muted-foreground"
              />
              Thông tin chi tiết
            </div>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                infoOpen && "rotate-180",
              )}
            />
          </button>

          {infoOpen && (
            <CardContent className="border-t px-4 pb-4 pt-0">
              <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Địa chỉ</p>
                  <div className="flex items-start gap-2 text-sm">
                    <HugeiconsIcon
                      icon={Location01Icon}
                      strokeWidth={2}
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    />
                    <span>{warehouse.address}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Ghi chú</p>
                  <div className="flex items-start gap-2 text-sm">
                    <HugeiconsIcon
                      icon={File01Icon}
                      strokeWidth={2}
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    />
                    <span className={cn(!warehouse.note && "text-muted-foreground italic")}>
                      {warehouse.note || "Không có ghi chú"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tọa độ</p>
                  <div className="flex items-start gap-2 text-sm">
                    <HugeiconsIcon
                      icon={PinLocation01Icon}
                      strokeWidth={2}
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    />
                    {warehouse.latitude && warehouse.longitude ? (
                      <span>
                        {warehouse.latitude}, {warehouse.longitude}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Chưa cập nhật</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Ngày tạo</p>
                  <div className="flex items-center gap-2 text-sm">
                    <HugeiconsIcon
                      icon={Calendar01Icon}
                      strokeWidth={2}
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                    <span>{formatDate(warehouse.createdAt)}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Cập nhật lần cuối</p>
                  <div className="flex items-center gap-2 text-sm">
                    <HugeiconsIcon
                      icon={Calendar01Icon}
                      strokeWidth={2}
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                    <span>{formatDate(warehouse.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={Package01Icon} strokeWidth={2} className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vật tư trong kho</p>
                <p className="text-lg font-semibold">{baseInventory.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={Building02Icon} strokeWidth={2} className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Danh mục</p>
                <p className="text-lg font-semibold">{uniqueCategories}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <HugeiconsIcon icon={Package01Icon} strokeWidth={2} className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sắp hết hàng</p>
                <p className="text-lg font-semibold">{lowStockCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory table */}
        <div className="rounded-lg border">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Vật tư trong kho</h2>
              <Badge variant="secondary">{baseInventory.length}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={activeCategory === null ? "all" : String(activeCategory)}
                onValueChange={(value) =>
                  setActiveCategory(value === "all" ? null : Number(value))
                }
              >
                <SelectTrigger>
                  <HugeiconsIcon icon={Tag02FreeIcons} className="text-red-600" />
                  <span className="text-muted-foreground">Danh mục:</span>
                  <SelectValue>
                    {activeCategory === null
                      ? "Tất cả"
                      : materialCategories.find((c) => c.id === activeCategory)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {materialCategories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative w-full max-w-xs">
                <HugeiconsIcon
                  icon={Building02Icon}
                  strokeWidth={2}
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Tìm vật tư, SKU..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="overflow-auto">
            <DataTable table={table} />
          </div>

          <div className="border-t px-6 py-3">
            <DataTablePagination table={table} />
          </div>
        </div>
      </div>
    </div>
  );
}
