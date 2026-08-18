"use client";

import {
  FileExportIcon,
  FileImportIcon,
  FileSyncIcon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TYPES = [
  {
    type: "notes",
    label: "Tất cả",
    href: "/notes",
    icon: Layers01Icon,
    enabled: true,
  },
  {
    type: "inbound",
    label: "Phiếu nhập kho",
    href: "/notes/inbound",
    icon: FileImportIcon,
    enabled: true,
  },
  {
    type: "outbound",
    label: "Phiếu xuất kho",
    href: "/notes/outbound",
    icon: FileExportIcon,
    enabled: false,
  },
  {
    type: "stocktake",
    label: "Phiếu kiểm kê",
    href: "/notes/stocktake",
    icon: FileSyncIcon,
    enabled: false,
  },
] as const;

/** Điều hướng giữa 3 loại chứng từ. Outbound/stocktake chờ backend nên tạm disabled. */
export function NoteTypeTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Loại chứng từ"
      className="flex shrink-0 items-center gap-0.5 border-b p-1"
    >
      {TYPES.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.type}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              "flex items-center gap-1.5",
              active
                ? "bg-secondary text-secondary-foreground"
                : "hover:bg-muted hover:text-foreground",
              item.enabled ? "" : "text-muted-foreground pointer-events-none",
            )}
          >
            <HugeiconsIcon icon={item.icon} className="size-4.5" />

            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
