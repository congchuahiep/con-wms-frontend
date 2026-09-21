"use client";

import {
  Archive01Icon,
  ArrowRight01Icon,
  Book01Icon,
  Chart01Icon,
  CircleDashedIcon,
  Invoice01Icon,
  Package01Icon,
  WarehouseIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetUserProfile } from "@/features/auth";
import { useGetDraftNoteCount } from "@/features/note-draft-count";
import {
  getMovementTypeColorClass,
  useGetStockBalances,
  useGetStockMovements,
} from "@/features/stock";
import { useGetWarehouses } from "@/features/warehouse";
import { cn } from "@/lib/utils";
import { formatDate, formatDecimal } from "@/utils/format";

const formatVND = (value: number) =>
  `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value)} ₫`;

const DRAFT_ROWS = [
  {
    key: "inboundNotes",
    href: "/notes/inbound",
    label: "Phiếu nhập",
    icon: Invoice01Icon,
  },
  {
    key: "outboundNotes",
    href: "/notes/outbound",
    label: "Phiếu xuất",
    icon: Archive01Icon,
  },
  {
    key: "stocktakeNotes",
    href: "/notes/stocktake",
    label: "Kiểm kê",
    icon: Book01Icon,
  },
] as const;

export default function DashboardPage() {
  const { data: profile, isLoading: isProfileLoading } = useGetUserProfile();

  const { data: warehouses } = useGetWarehouses({ includeSite: true });
  const { data: balances } = useGetStockBalances();
  const { data: draftCount } = useGetDraftNoteCount();
  const { data: movements } = useGetStockMovements({ pageSize: 8 });

  const totalStockValue = useMemo(
    () =>
      (balances ?? []).reduce(
        (sum, item) => sum + (item.stockValue ? Number(item.stockValue) : 0),
        0,
      ),
    [balances],
  );

  const stockedMaterialCount = useMemo(
    () => new Set((balances ?? []).map((item) => item.material.id)).size,
    [balances],
  );

  const recentMovements = movements?.items ?? [];

  if (isProfileLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-auto p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Xin chào, {profile?.firstName ?? "bạn"}!
        </h1>
        <p className="text-muted-foreground">
          Tổng quan hệ thống quản lý vật tư
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/warehouses" className="min-w-0">
          <Card className="h-full transition-colors hover:bg-accent/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Kho đang quản lý
              </CardTitle>
              <HugeiconsIcon
                icon={WarehouseIcon}
                strokeWidth={2}
                className="size-5 text-red-700"
              />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {warehouses
                  ? warehouses.filter((warehouse) => warehouse.isActive).length
                  : "-"}
              </div>
              <p className="text-xs text-muted-foreground">Nhà kho hoạt động</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inventory" className="min-w-0">
          <Card className="h-full transition-colors hover:bg-accent/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Vật tư đang tồn
              </CardTitle>
              <HugeiconsIcon
                icon={Package01Icon}
                strokeWidth={2}
                className="size-5 text-yellow-700"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {balances ? stockedMaterialCount : "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                Mặt hàng có tồn kho
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inventory" className="min-w-0">
          <Card className="h-full transition-colors hover:bg-accent/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Giá trị tồn kho
              </CardTitle>
              <HugeiconsIcon
                icon={Chart01Icon}
                strokeWidth={2}
                className="size-5 text-purple-700"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {balances ? formatVND(totalStockValue) : "—"}
              </div>
              <p className="text-xs text-muted-foreground">
                theo giá nhập gần nhất
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/notes" className="min-w-0">
          <Card className="h-full transition-colors hover:bg-accent/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Phiếu nháp chờ xử lý
              </CardTitle>
              <HugeiconsIcon
                icon={CircleDashedIcon}
                strokeWidth={2}
                className="size-5 text-green-700"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {draftCount ? draftCount.total : "—"}
              </div>
              <p className="text-xs text-muted-foreground">
                Nhập / xuất / kiểm kê
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Công việc cần xử lý + Hoạt động gần đây */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Công việc cần xử lý</CardTitle>
            {draftCount && draftCount.total > 0 && (
              <Link
                href="/notes"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                Xem tất cả
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="size-4"
                />
              </Link>
            )}
          </CardHeader>
          <CardContent className="pt-2">
            {!draftCount ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="size-5" />
              </div>
            ) : draftCount.total === 0 ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <HugeiconsIcon
                  icon={CircleDashedIcon}
                  strokeWidth={2}
                  className="size-4"
                />
                Không có phiếu nháp nào đang chờ
              </div>
            ) : (
              <div className="divide-y">
                {DRAFT_ROWS.map((row) => (
                  <Link
                    key={row.key}
                    href={row.href}
                    className="flex items-center gap-3 py-3 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground border">
                      <HugeiconsIcon
                        icon={row.icon}
                        strokeWidth={2}
                        className="size-4"
                      />
                    </div>
                    <span className="flex-1 text-sm font-medium">
                      {row.label}
                    </span>
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {draftCount[row.key]} nháp
                    </span>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      strokeWidth={2}
                      className="size-4 text-muted-foreground"
                    />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
            <Link
              href="/stock-movements"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Xem tất cả
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="size-4"
              />
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            {!movements ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="size-5" />
              </div>
            ) : recentMovements.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <HugeiconsIcon
                  icon={CircleDashedIcon}
                  strokeWidth={2}
                  className="size-4"
                />
                Chưa có hoạt động nào
              </div>
            ) : (
              <div className="divide-y">
                {recentMovements.map((movement) => {
                  const quantity = Number(movement.quantity);
                  return (
                    <div key={movement.id} className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            getMovementTypeColorClass(movement.movementType),
                            "truncate rounded-full border px-2 py-0.5 text-xs font-medium",
                          )}
                        >
                          {movement.movementTypeLabel.split(":")[0]}
                        </span>
                        <span
                          className={cn(
                            "ml-auto shrink-0 text-sm font-medium tabular-nums",
                            quantity > 0 && "text-emerald-600",
                            quantity < 0 && "text-destructive",
                          )}
                        >
                          {quantity > 0
                            ? `+${formatDecimal(movement.quantity)}`
                            : formatDecimal(movement.quantity)}
                        </span>
                      </div>
                      <div className="mt-1 truncate text-sm">
                        {movement.material.name}
                        <span className="text-muted-foreground">
                          {" "}
                          · {movement.warehouse.name} ·{" "}
                          {formatDate(movement.date)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
