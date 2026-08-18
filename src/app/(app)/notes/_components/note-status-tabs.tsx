"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUSES = [
  { status: "draft", label: "Nháp" },
  { status: "posted", label: "Đã chốt" },
  { status: "voided", label: "Đã hủy" },
] as const;

interface NoteStatusTabsProps {
  status: string | null;
  onStatusChange: (status: string) => void;
}

/** Hàng button lọc theo vòng đời phiếu — nhúng vào header của từng trang. */
export function NoteStatusTabs({
  status,
  onStatusChange,
}: NoteStatusTabsProps) {
  return (
    <div className="flex items-center -my-2">
      {STATUSES.map((item) => {
        const active = status === item.status;
        return (
          <Button
            key={item.status}
            type="button"
            variant="ghost"
            onClick={() => onStatusChange(item.status)}
            className={cn(
              "h-11 border-0 rounded-none border-transparent border-b-2 text-secondary-foreground translate-y-0.5",
              "text-muted-foreground",
              active &&
                "text-accent-foreground hover:bg-accent hover:text-accent-foreground border-b-2 border-primary translate-y-0",
            )}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}
