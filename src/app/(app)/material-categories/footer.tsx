"use client";

import type { Table } from "@tanstack/react-table";
import type { MaterialCategory } from "@/features/material-category";

interface MaterialCategoriesFooterProps {
  table: Table<MaterialCategory>;
  totalCount: number;
}

export function MaterialCategoriesFooter({
  table,
  totalCount,
}: MaterialCategoriesFooterProps) {
  const visibleCount = table.getRowModel().rows.length;

  if (visibleCount === totalCount) {
    return (
      <footer className="shrink-0 border-t px-6 py-2">
        <p className="text-sm text-muted-foreground">{totalCount} danh mục</p>
      </footer>
    );
  }

  return (
    <footer className="shrink-0 border-t px-6 py-2">
      <p className="text-sm text-muted-foreground">
        {visibleCount} / {totalCount} danh mục
      </p>
    </footer>
  );
}
