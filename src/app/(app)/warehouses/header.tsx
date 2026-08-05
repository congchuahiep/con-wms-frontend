import Building02Icon from "@hugeicons/core-free-icons/Building02Icon";
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon";
import Upload01Icon from "@hugeicons/core-free-icons/Upload01Icon";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { useGetUserProfile } from "@/features/auth";
import { cn } from "@/lib/utils";
import { WarehouseCreateDialog } from "./create-dialog";

export default function WarehouseHeader() {
  const userProfile = useGetUserProfile();

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
        {userProfile.data?.role === "admin" && <WarehouseCreateDialog />}
      </div>
    </header>
  );
}
