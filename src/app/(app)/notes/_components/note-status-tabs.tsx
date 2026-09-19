"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DRAFT_COUNT_FIELD,
  type NoteType,
  useGetDraftNoteCount,
} from "@/features/note-draft-count";
import { cn } from "@/lib/utils";

const STATUSES = [
  { status: "draft", label: "Nháp" },
  { status: "posted", label: "Đã chốt" },
  { status: "voided", label: "Đã hủy" },
] as const;

interface NoteStatusTabsProps {
  noteType: NoteType;
}

/**
 * Hàng button lọc theo vòng đời phiếu — nhúng vào header của từng trang.
 *
 * Tab sống trên URL `<pathname>?status=...`: trạng thái đang chọn đọc từ
 * search param, chuyển tab dùng `router.push` ngay trên pathname hiện tại —
 * không tạo route con cho từng status. Các search param khác được giữ
 * nguyên, `page` được reset về trang 1.
 */
export function NoteStatusTabs({ noteType }: NoteStatusTabsProps) {
  return (
    <Suspense fallback={<NoteStatusTabsFallback />}>
      <NoteStatusTabsInner noteType={noteType} />
    </Suspense>
  );
}

/** Giữ chiều cao header ổn định trong lúc chưa có URL phía server. */
function NoteStatusTabsFallback() {
  return (
    <div className="flex items-center -my-2" aria-hidden>
      {STATUSES.map((item) => (
        <div key={item.status} className="h-11 w-20" />
      ))}
    </div>
  );
}

function NoteStatusTabsInner({ noteType }: NoteStatusTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: draftCounts } = useGetDraftNoteCount();
  const draftCount = draftCounts?.[DRAFT_COUNT_FIELD[noteType]] ?? 0;

  // Khớp default "posted" của useXxxNoteParams khi URL chưa có ?status=.
  const activeStatus = searchParams.get("status") ?? "posted";

  const handleChange = useCallback(
    (status: string) => {
      if (status === searchParams.get("status")) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set("status", status);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex items-center -my-2">
      {STATUSES.map((item) => {
        const active = activeStatus === item.status;
        return (
          <Button
            key={item.status}
            type="button"
            variant="ghost"
            onClick={() => handleChange(item.status)}
            className={cn(
              "h-11 border-0 rounded-none border-transparent border-b-2 text-secondary-foreground translate-y-0.5",
              "text-muted-foreground",
              active &&
                "text-accent-foreground hover:bg-accent hover:text-accent-foreground border-b-2 border-primary translate-y-0",
            )}
          >
            {item.label}

            {item.status === "draft" && draftCount > 0 && (
              <Badge className="p-0 size-5" variant="warning" >
                {draftCount}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}
