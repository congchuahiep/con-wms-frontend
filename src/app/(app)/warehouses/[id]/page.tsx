"use client";

import {
  ArrowLeft01Icon,
  Building02Icon,
  Calendar01Icon,
  File01Icon,
  Location01Icon,
  Package01Icon,
  PinLocation01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetStockBalances, useGetStockMovements } from "@/features/stock";
import { useGetWarehouse, type Warehouse } from "@/features/warehouse";
import { cn } from "@/lib/utils";
import { formatDate, formatDecimal, formatMoney } from "@/utils/format";

export default function WarehouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const warehouseId = Number(params.id);

  const { data: warehouse, status } = useGetWarehouse(warehouseId);
  const { data: balances = [] } = useGetStockBalances({
    warehouse: warehouseId,
  });
  const { data: movementsData } = useGetStockMovements({
    warehouse: warehouseId,
    pageSize: 10,
  });
  const recentMovements = movementsData?.items ?? [];

  const [search, setSearch] = useState("");

  const filteredBalances = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return balances;
    return balances.filter(
      (b) =>
        b.material.code.toLowerCase().includes(q) ||
        b.material.name.toLowerCase().includes(q),
    );
  }, [balances, search]);

  const totalStockValue = useMemo(
    () =>
      balances.reduce((sum, b) => {
        if (!b.lastPurchasePrice) return sum;
        return sum + Number(b.quantity) * Number(b.lastPurchasePrice);
      }, 0),
    [balances],
  );

  if (status === "pending") return <WarehouseDetailSkeleton />;

  if (status === "error" || !warehouse) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          {status === "error"
            ? "Đã có lỗi xảy ra khi tải dữ liệu kho"
            : "Không tìm thấy kho"}
        </p>
        <Button onClick={() => router.push("/warehouses")}>
          Quay lại danh sách kho
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <WarehouseDetailHeader warehouse={warehouse} />

      <div className="flex-1 overflow-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
          <WarehouseInfoCard warehouse={warehouse} />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={Package01Icon}
              label="Số mặt hàng"
              value={String(warehouse.itemCount)}
              tone="bg-primary/10 text-primary"
            />
            <StatCard
              icon={Building02Icon}
              label="Tổng tồn"
              value={formatDecimal(warehouse.totalQuantity)}
              tone="bg-primary/10 text-primary"
            />
            <StatCard
              icon={Package01Icon}
              label="Đã hết tồn"
              value={String(warehouse.lowStock)}
              tone="bg-destructive/10 text-destructive"
            />
            <StatCard
              icon={Wallet01Icon}
              label="Giá trị tồn"
              value={totalStockValue > 0 ? formatMoney(totalStockValue) : "—"}
              tone="bg-primary/10 text-primary"
            />
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base">Tồn kho hiện tại</CardTitle>
              <Badge variant="secondary">
                {filteredBalances.length} vật tư
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative max-w-xs">
                <HugeiconsIcon
                  icon={Location01Icon}
                  strokeWidth={2}
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Tìm theo mã, tên vật tư..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {filteredBalances.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Kho chưa có dòng sổ kho nào — tạo phiếu nhập để bắt đầu.
                </p>
              ) : (
                <div className="overflow-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                        <th className="px-3 py-2 font-medium">Mã</th>
                        <th className="px-3 py-2 font-medium">Tên vật tư</th>
                        <th className="px-3 py-2 font-medium text-right">
                          Đơn vị
                        </th>
                        <th className="px-3 py-2 font-medium text-right">
                          Tồn kho
                        </th>
                        <th className="px-3 py-2 font-medium text-right">
                          Giá nhập gần nhất
                        </th>
                        <th className="px-3 py-2 font-medium text-right">
                          Giá trị
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBalances.map((b) => (
                        <tr
                          key={`${b.warehouse.id}-${b.material.id}`}
                          className="border-b last:border-0 hover:bg-muted/30"
                        >
                          <td className="px-3 py-2 font-mono text-xs">
                            {b.material.code}
                          </td>
                          <td className="px-3 py-2 font-medium">
                            {b.material.name}
                          </td>
                          <td className="px-3 py-2 text-right text-muted-foreground">
                            {b.unit.code}
                          </td>
                          <td className="px-3 py-2 text-right font-medium tabular-nums">
                            {formatDecimal(b.quantity)}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                            {b.lastPurchasePrice
                              ? formatMoney(b.lastPurchasePrice)
                              : "—"}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums">
                            {formatMoney(b.stockValue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base">Sổ kho gần đây</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                render={<Link href="/stock-movements" />}
                nativeButton={false}
              >
                Xem toàn bộ sổ kho →
              </Button>
            </CardHeader>
            <CardContent>
              {recentMovements.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Chưa có giao dịch nào cho kho này.
                </p>
              ) : (
                <ul className="divide-y">
                  {recentMovements.map((m) => {
                    const negative = Number(m.quantity) < 0;
                    return (
                      <li
                        key={m.id}
                        className="flex items-center justify-between gap-3 py-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={cn(
                              "w-20 shrink-0 font-mono text-sm font-semibold tabular-nums",
                              negative
                                ? "text-destructive"
                                : "text-emerald-600",
                            )}
                          >
                            {formatDecimal(m.quantity, 3)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {m.movementTypeLabel}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {formatDate(m.date)} · {m.material.code} ·{" "}
                              {m.createdBy.email}
                            </p>
                          </div>
                        </div>
                        {m.reason && (
                          <span className="hidden max-w-56 truncate text-xs text-muted-foreground sm:block">
                            {m.reason}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function WarehouseDetailHeader({ warehouse }: { warehouse: Warehouse }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b px-4 py-4">
      <div className="flex items-center gap-3">
        <Link
          href="/warehouses"
          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={2}
            className="size-5"
          />
        </Link>
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <HugeiconsIcon
            icon={Building02Icon}
            strokeWidth={2}
            className="size-5"
          />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">
              {warehouse.name}
            </h1>
            {warehouse.site ? (
              <Badge variant="outline" className="text-xs">
                Kho công trường · {warehouse.site.code}
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Kho thường
              </Badge>
            )}
            <Badge
              variant={warehouse.isActive ? "default" : "secondary"}
              className="text-xs"
            >
              {warehouse.isActive ? "Hoạt động" : "Ngừng sử dụng"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {warehouse.code}
            {warehouse.address ? ` · ${warehouse.address}` : ""}
          </p>
        </div>
      </div>
    </header>
  );
}

function WarehouseInfoCard({ warehouse }: { warehouse: Warehouse }) {
  return (
    <Card>
      <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
        <InfoRow
          icon={Location01Icon}
          label="Địa chỉ"
          value={warehouse.address || "Chưa cập nhật"}
          muted={!warehouse.address}
        />
        <InfoRow
          icon={Building02Icon}
          label="Loại kho"
          value={
            warehouse.site
              ? `Kho công trường — ${warehouse.site.name} (${warehouse.site.code})`
              : "Kho thường (trung tâm)"
          }
        />
        <InfoRow
          icon={File01Icon}
          label="Ghi chú"
          value={warehouse.note || "Không có ghi chú"}
          muted={!warehouse.note}
        />
        <InfoRow
          icon={PinLocation01Icon}
          label="Tọa độ"
          value={
            warehouse.latitude != null && warehouse.longitude != null
              ? `${warehouse.latitude}, ${warehouse.longitude}`
              : "Chưa cập nhật"
          }
          muted={warehouse.latitude == null}
        />
        <InfoRow
          icon={Calendar01Icon}
          label="Ngày tạo"
          value={formatDate(warehouse.createdAt.split("T")[0])}
        />
        <InfoRow
          icon={Calendar01Icon}
          label="Cập nhật lần cuối"
          value={formatDate(warehouse.updatedAt.split("T")[0])}
        />
      </CardContent>
    </Card>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  muted = false,
}: {
  icon: typeof Location01Icon;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-start gap-2 text-sm">
        <HugeiconsIcon
          icon={Icon}
          strokeWidth={2}
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        />
        <span className={cn(muted && "italic text-muted-foreground")}>
          {value}
        </span>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Package01Icon;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            tone,
          )}
        >
          <HugeiconsIcon icon={Icon} strokeWidth={2} className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="truncate text-lg font-semibold tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function WarehouseDetailSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-4">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="size-10 rounded-lg" />
        <Skeleton className="h-6 w-64" />
      </header>
      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
