"use client";

import { Pagination } from "@/components/ui/pagination";

interface StockMovementsFooterProps {
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}

export function StockMovementsFooter({
  page,
  pageSize,
  total,
  onPageChange,
}: StockMovementsFooterProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <footer className="shrink-0 flex items-center justify-between border-t px-6 py-2">
      <p className="text-sm text-muted-foreground">
        {from}–{to} / {total}
      </p>
      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={onPageChange}
      />
    </footer>
  );
}
