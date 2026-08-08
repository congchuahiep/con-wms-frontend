"use client";

import type { Table } from "@tanstack/react-table";
import type { Unit } from "@/features/unit";

interface UnitsFooterProps {
  table: Table<Unit>;
  totalCount: number;
}

export function UnitsFooter({ table, totalCount }: UnitsFooterProps) {
  const visibleCount = table.getRowModel().rows.length;

  if (visibleCount === totalCount) {
    return (
      <footer className="shrink-0 border-t px-6 py-2">
        <p className="text-sm text-muted-foreground">{totalCount} đơn vị</p>
      </footer>
    );
  }

  return (
    <footer className="shrink-0 border-t px-6 py-2">
      <p className="text-sm text-muted-foreground">
        {visibleCount} / {totalCount} đơn vị
      </p>
    </footer>
  );
}
