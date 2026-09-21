"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  /** Trang hiện tại — 1-based. */
  page: number;
  /** Tổng số trang (≥ 1). */
  pageCount: number;
  onPageChange: (page: number) => void;
}

type PageItem =
  | { type: "page"; page: number }
  | { type: "ellipsis"; key: "ellipsis-left" | "ellipsis-right" };

/**
 * Dãy nút số trang có thu gọn "…":
 * - trang 1 của 10:     1 2 3 … 9 10
 * - trang 6 của 10:     1 2 … 5 6 7 … 9 10
 * Quy tắc: luôn hiện 2 trang đầu/cuối; khi đang ở 3 trang đầu thì mở rộng đầu
 * thành 3 trang; hiện trang hiện tại ± 1; khoảng trống thay bằng "…".
 */
function getPageItems(page: number, pageCount: number): PageItem[] {
  const start = page <= 3 ? [1, 2, 3] : [1, 2];
  const end = [pageCount - 1, pageCount];
  const middle = [page - 1, page, page + 1];

  const pages = [...new Set([...start, ...middle, ...end])]
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];
  let previous = 0;
  for (const p of pages) {
    if (p - previous > 1) {
      items.push({
        type: "ellipsis",
        key: p < page ? "ellipsis-left" : "ellipsis-right",
      });
    }
    items.push({ type: "page", page: p });
    previous = p;
  }
  return items;
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const items = getPageItems(safePage, pageCount);

  return (
    <div className="flex items-center gap-1">
      <Button
        size="icon-xs"
        variant="outline"
        disabled={safePage <= 1}
        onClick={() => onPageChange(safePage - 1)}
        aria-label="Trang trước"
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          strokeWidth={2}
          className="size-4"
        />
      </Button>

      {items.map((item) =>
        item.type === "ellipsis" ? (
          <span
            key={item.key}
            className="min-w-5 select-none text-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Button
            key={item.page}
            size="icon-xs"
            variant={item.page === safePage ? "default" : "outline"}
            onClick={() => onPageChange(item.page)}
            aria-current={item.page === safePage ? "page" : undefined}
          >
            {item.page}
          </Button>
        ),
      )}

      <Button
        size="icon-xs"
        variant="outline"
        disabled={safePage >= pageCount}
        onClick={() => onPageChange(safePage + 1)}
        aria-label="Trang sau"
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          strokeWidth={2}
          className="size-4"
        />
      </Button>
    </div>
  );
}
