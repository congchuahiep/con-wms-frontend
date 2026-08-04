import Add01Icon from "@hugeicons/core-free-icons/Add01Icon";
import Building02Icon from "@hugeicons/core-free-icons/Building02Icon";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import Upload01Icon from "@hugeicons/core-free-icons/Upload01Icon";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import type { Warehouse } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

export default function WarehouseHeader({
  warehouses,
}: {
  warehouses: Warehouse[];
}) {
  const totalItems = warehouses.reduce((sum, wh) => sum + wh.itemCount, 0);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-background",
        "flex shrink-0 items-center justify-between gap-4 border-b py-2 px-3",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-7 items-center justify-center rounded-lg",
            "bg-accent text-accent-foreground border",
          )}
        >
          <HugeiconsIcon
            icon={Building02Icon}
            strokeWidth={2}
            className="size-5"
          />
        </div>

        <h1 className="font-semibold tracking-tight">Quản lý kho</h1>
        <p className="text-sm text-muted-foreground">
          {warehouses.length} nhà kho &middot; {totalItems} mặt hàng đang lưu
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <HugeiconsIcon
            icon={Download01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Xuất CSV
        </Button>
        <Button variant="outline" size="sm" disabled>
          <HugeiconsIcon
            icon={Upload01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Nhập kho
        </Button>
        <Button size="sm" disabled>
          <HugeiconsIcon
            icon={Add01Icon}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Thêm kho
        </Button>
      </div>
    </header>
  );
}
