"use client";

import {
  Add01Icon,
  ArrowLeft01Icon,
  ConstructionIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUserProfile } from "@/features/auth";
import { type Site, siteStatusLabel } from "@/features/site";
import { cn } from "@/lib/utils";

interface SiteDetailHeaderProps {
  name: string;
  code: string;
  status: Site["status"];
  siteId: number;
  warehouseId: number | null;
  warehouseCode: string | null;
  isActive: boolean;
  onEdit: () => void;
  onEditRequirements: () => void;
  onSettle: () => void;
}

export function SiteDetailHeader({
  name,
  code,
  status,
  siteId,
  warehouseId,
  warehouseCode,
  isActive,
  onEdit,
  onEditRequirements,
  onSettle,
}: SiteDetailHeaderProps) {
  const router = useRouter();
  const { data: profile } = useGetUserProfile();
  const role = profile?.role;
  // Backend: sites create/update/settle = IsAdmin; phiếu (nhập/xuất/kiểm kê) = IsAdminOrStorekeeper
  const isAdmin = role === "admin";
  const canCreateNote = isAdmin || role === "storekeeper";
  const canCreateNow = canCreateNote && isActive && warehouseId !== null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-background",
        "flex shrink-0 items-center justify-between gap-4 border-b py-2 px-3",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/sites"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Quay lại danh sách công trường"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            strokeWidth={2}
            className="size-5"
          />
        </Link>
        <div
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-lg",
            "bg-accent text-accent-foreground border",
          )}
        >
          <HugeiconsIcon
            icon={ConstructionIcon}
            strokeWidth={2}
            className="size-5"
          />
        </div>
        <h1 className="truncate font-semibold tracking-tight">{name}</h1>
        <StatusBadge status={status} />
        <p className="hidden shrink-0 text-sm text-muted-foreground md:block">
          {code}
          {warehouseCode ? ` · Kho ${warehouseCode}` : ""}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {canCreateNote && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm" disabled={!canCreateNow} />
              }
            >
              <HugeiconsIcon
                icon={Add01Icon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              Tạo phiếu
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={!canCreateNow}
                onClick={() =>
                  router.push(`/notes/inbound?warehouseId=${warehouseId}`)
                }
              >
                Phiếu nhập
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!canCreateNow}
                onClick={() =>
                  router.push(
                    `/notes/outbound?siteId=${siteId}&warehouseId=${warehouseId}`,
                  )
                }
              >
                Phiếu xuất
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!canCreateNow}
                onClick={() =>
                  router.push(`/notes/stocktake?warehouseId=${warehouseId}`)
                }
              >
                Phiếu kiểm kê
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {isAdmin && (
          <>
            <Button variant="outline" size="sm" onClick={onEdit}>
              Chỉnh sửa
            </Button>
            <Button variant="outline" size="sm" onClick={onEditRequirements}>
              Định mức
            </Button>
            <Button
              size="sm"
              onClick={onSettle}
              disabled={!isActive}
              title={
                isActive
                  ? "Tất toán khi công trường đã đủ định mức và hoàn thành"
                  : "Công trường đã đóng — không tất toán được nữa"
              }
            >
              Tất toán
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

function StatusBadge({ status }: { status: Site["status"] }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs",
        status === "active" &&
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
        status === "completed" &&
          "border-sky-500/30 bg-sky-500/10 text-sky-600",
        status === "inactive" && "border-border bg-muted text-muted-foreground",
      )}
    >
      {siteStatusLabel(status)}
    </Badge>
  );
}
