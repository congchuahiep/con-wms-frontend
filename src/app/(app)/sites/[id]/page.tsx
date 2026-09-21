"use client";

import {
  Calendar01Icon,
  CircleCheckIcon,
  ConstructionIcon,
  File01Icon,
  PinLocation01Icon,
  SmartPhone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type SiteRequirementRow,
  useGetSite,
  useGetSiteRequirements,
} from "@/features/site";
import { cn } from "@/lib/utils";
import { formatDate, formatDateTime } from "@/utils/format";
import { EditSiteDialog } from "../edit-dialog";
import { createRequirementColumns } from "./columns";
import { SiteDetailHeader } from "./header";
import { RequirementsDialog } from "./requirements-dialog";
import { SettleDialog } from "./settle-dialog";

export default function SiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = Number(params.id);

  const { data: site, status } = useGetSite(siteId);
  const { data: rows = [] } = useGetSiteRequirements(siteId, {
    enabled: status === "success",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [settleOpen, setSettleOpen] = useState(false);

  if (status === "pending") return <SiteDetailSkeleton />;

  if (status === "error" || !site) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          {status === "error"
            ? "Đã có lỗi xảy ra khi tải dữ liệu công trường"
            : "Không tìm thấy công trường"}
        </p>
        <Button onClick={() => router.push("/sites")}>
          Quay lại danh sách công trường
        </Button>
      </div>
    );
  }

  const isActive = site.status === "active";

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <SiteDetailHeader
        name={site.name}
        code={site.code}
        status={site.status}
        siteId={site.id}
        warehouseId={site.warehouse?.id ?? null}
        warehouseCode={site.warehouse?.code ?? null}
        isActive={isActive}
        onEdit={() => setEditOpen(true)}
        onEditRequirements={() => setRequirementsOpen(true)}
        onSettle={() => setSettleOpen(true)}
      />

      <div className="flex-1 overflow-auto">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
          <SiteInfoCard site={site} />

          <RequirementsCard rows={rows} isActive={isActive} />
        </div>
      </div>

      <EditSiteDialog
        site={editOpen ? site : null}
        onClose={() => setEditOpen(false)}
      />

      <RequirementsDialog
        siteId={site.id}
        rows={rows}
        open={requirementsOpen}
        onOpenChange={setRequirementsOpen}
      />

      <SettleDialog
        site={site}
        rows={rows}
        open={settleOpen}
        onOpenChange={setSettleOpen}
      />
    </div>
  );
}

function SiteInfoCard({
  site,
}: {
  site: NonNullable<ReturnType<typeof useGetSite>["data"]>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Thông tin công trường</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        <InfoRow
          icon={UserIcon}
          label="Người phụ trách"
          value={site.manager || "Chưa cập nhật"}
          muted={!site.manager}
        />
        <InfoRow
          icon={SmartPhone01Icon}
          label="SĐT"
          value={site.phone || "Chưa cập nhật"}
          muted={!site.phone}
        />
        <InfoRow
          icon={PinLocation01Icon}
          label="Địa chỉ"
          value={site.address || "Chưa cập nhật"}
          muted={!site.address}
        />
        <InfoRow
          icon={File01Icon}
          label="Ghi chú"
          value={site.note || "Không có ghi chú"}
          muted={!site.note}
        />
        <InfoRow
          icon={ConstructionIcon}
          label="Kho công trường"
          value={
            site.warehouse
              ? `${site.warehouse.code} - ${site.warehouse.name}`
              : "Chưa có kho"
          }
        />
        {site.status === "completed" ? (
          <InfoRow
            icon={CircleCheckIcon}
            label="Tất toán"
            value={`${formatDateTime(site.settledAt)} · ${site.settledBy?.email ?? ""}`}
          />
        ) : (
          <InfoRow
            icon={CircleCheckIcon}
            label="Tất toán"
            value="Chưa tất toán"
            muted
          />
        )}
        <InfoRow
          icon={Calendar01Icon}
          label="Ngày tạo"
          value={formatDate(site.createdAt.split("T")[0])}
        />
        <InfoRow
          icon={Calendar01Icon}
          label="Cập nhật lần cuối"
          value={formatDate(site.updatedAt.split("T")[0])}
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
  icon: typeof UserIcon;
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

function RequirementsCard({
  rows,
  isActive,
}: {
  rows: SiteRequirementRow[];
  isActive: boolean;
}) {
  const columns = useMemo(() => createRequirementColumns(), []);
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="pb-0 bg-muted/20">
      <CardHeader className="flex items-center justify-between space-y-0">
        <CardTitle className="text-base">Định mức &amp; tồn kho</CardTitle>
        <Badge variant="secondary">{rows.length} dòng</Badge>
      </CardHeader>
      <CardContent className="p-2">
        <div className="border overflow-hidden rounded shadow bg-background">
          <DataTable
            table={table}
            className="rounded-b-lg"
            emptyPlaceholder={
              isActive
                ? "Chưa khai báo định mức — bấm “Định mức” trên header để khai báo vật tư cần dùng."
                : "Công trường không có dữ liệu định mức/tồn kho."
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

function SiteDetailSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-4">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="size-10 rounded-lg" />
        <Skeleton className="h-6 w-64" />
      </header>
      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
