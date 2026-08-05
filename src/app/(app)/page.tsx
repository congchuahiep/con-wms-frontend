"use client";

import {
  ArrowRight01Icon,
  Building02Icon,
  Chart01Icon,
  Package01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetUserProfile } from "@/features/auth";
import { inventory, materials, warehouses } from "@/lib/mock/data";

export default function DashboardPage() {
  const { data: profile, isLoading } = useGetUserProfile();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Spinner className="size-8" />
      </div>
    );
  }

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStock = inventory.filter((item) => item.quantity < 50).length;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng kho</CardTitle>
            <HugeiconsIcon
              icon={Building02Icon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {warehouses.length}
            </div>
            <p className="text-xs text-muted-foreground">
              nhà kho đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng vật tư</CardTitle>
            <HugeiconsIcon
              icon={Package01Icon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {materials.length}
            </div>
            <p className="text-xs text-muted-foreground">
              mặt hàng trong danh mục
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số lượng</CardTitle>
            <HugeiconsIcon
              icon={Chart01Icon}
              strokeWidth={2}
              className="size-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {totalItems.toLocaleString("vi-VN")}
            </div>
            <p className="text-xs text-muted-foreground">đơn vị tồn kho</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp hết</CardTitle>
            <Badge
              variant="destructive"
              className="size-4 rounded-full p-0 text-[10px] leading-none"
            >
              !
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">{lowStock}</div>
            <p className="text-xs text-muted-foreground">
              mặt hàng dưới 50 đơn vị
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/warehouses">
          <Card className="transition-colors hover:bg-accent/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <HugeiconsIcon
                  icon={Building02Icon}
                  strokeWidth={2}
                  className="size-5"
                />
                Quản lý kho
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="ml-auto size-4 text-muted-foreground"
                />
              </CardTitle>
              <CardDescription>
                Xem tồn kho theo từng nhà kho, nhập/xuất vật tư
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/materials">
          <Card className="transition-colors hover:bg-accent/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <HugeiconsIcon
                  icon={Package01Icon}
                  strokeWidth={2}
                  className="size-5"
                />
                Vật tư
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="ml-auto size-4 text-muted-foreground"
                />
              </CardTitle>
              <CardDescription>
                Quản lý danh mục, phân loại và thông tin vật tư
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/inventory">
          <Card className="transition-colors hover:bg-accent/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <HugeiconsIcon
                  icon={Chart01Icon}
                  strokeWidth={2}
                  className="size-5"
                />
                Tồn kho
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="ml-auto size-4 text-muted-foreground"
                />
              </CardTitle>
              <CardDescription>
                Xem tổng tồn kho toàn công ty theo từng kho
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
