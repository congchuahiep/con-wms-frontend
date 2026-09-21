"use client";

import { CircleDashedIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SiteStatus } from "@/features/site";

type StatusFilter = SiteStatus | "all";

interface SitesFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang hoạt động" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

export function SitesFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: SitesFilterBarProps) {
  return (
    <div className="shrink-0 border-b px-3 py-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Select
            value={status}
            onValueChange={(next) => {
              if (next === null) return;
              onStatusChange(next as StatusFilter);
            }}
          >
            <SelectTrigger>
              <HugeiconsIcon
                icon={CircleDashedIcon}
                strokeWidth={2}
                className={
                  status === "active"
                    ? "text-emerald-600"
                    : status === "completed"
                      ? "text-sky-600"
                      : "text-muted-foreground"
                }
              />
              <span className="text-muted-foreground">Trạng thái:</span>
              <SelectValue placeholder="Tất cả">
                {(value: string) =>
                  STATUS_OPTIONS.find((o) => o.value === value)?.label ?? value
                }
              </SelectValue>
            </SelectTrigger>

            <SelectContent alignItemWithTrigger={false}>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full max-w-xs">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Tìm mã/tên công trường..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}
