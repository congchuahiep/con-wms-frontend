"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

interface MaterialsFooterProps {
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}

export function MaterialsFooter({
  page,
  pageSize,
  total,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: MaterialsFooterProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <footer className="shrink-0 flex items-center justify-between border-t px-6 py-2">
      <p className="text-sm text-muted-foreground">
        {from}–{to} / {total}
      </p>
      <div className="flex items-center gap-1">
        <Button
          size="icon-xs"
          variant="outline"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
        </Button>
        <span className="text-sm text-muted-foreground min-w-[3ch] text-center">
          {page}
        </span>
        <Button
          size="icon-xs"
          variant="outline"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
        </Button>
      </div>
    </footer>
  );
}
