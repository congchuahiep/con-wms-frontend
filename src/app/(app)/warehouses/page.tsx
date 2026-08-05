"use client";

import { WarehouseIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWarehouses, type Warehouse } from "@/features/warehouse";
import WarehouseHeader from "./header";
import { WarehouseItem } from "./item";

export default function WarehousesPage() {
  const { data: warehouses, status } = useGetWarehouses();

  const content = () => {
    switch (status) {
      case "pending":
        return <LoadingWarehouseList />;
      case "error":
        return <ErrorWarehouseList />;
      case "success":
        return <WarehouseList warehouses={warehouses} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col overflow-auto">
      <WarehouseHeader />

      {content()}
    </div>
  );
}

function WarehouseList({ warehouses }: { warehouses: Warehouse[] }) {
  if (warehouses.length === 0)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={WarehouseIcon} />
          </EmptyMedia>
          <EmptyTitle>Hệ thống chưa có nhà kho nào cả</EmptyTitle>
          <EmptyDescription>
            Bạn chưa tạo nhà kho nào cả. Hãy tạo một nhà kho mới để bắt đầu.
          </EmptyDescription>
          <EmptyContent className="flex-row justify-center gap-2">
            <Button>Create Project</Button>
          </EmptyContent>
        </EmptyHeader>
      </Empty>
    );

  return (
    <div className="flex-1 flex flex-col gap-4 p-4">
      {warehouses.map((warehouse) => (
        <WarehouseItem key={warehouse.id} warehouse={warehouse} />
      ))}
    </div>
  );
}

function LoadingWarehouseList() {
  return (
    <div className="flex-1 flex flex-col gap-4 p-4">
      {Array.from({ length: 10 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Static element
        <Skeleton key={index} className="h-56 w-full" />
      ))}
    </div>
  );
}

function ErrorWarehouseList() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={WarehouseIcon} />
        </EmptyMedia>
        <EmptyTitle>Đã có lỗi xảy ra khi tải danh sách nhà kho</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
