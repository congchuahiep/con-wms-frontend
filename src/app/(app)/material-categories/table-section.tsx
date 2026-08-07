"use client";

import type { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { MaterialCategory } from "@/features/material-category";

interface MaterialCategoriesTableSectionProps {
  table: Table<MaterialCategory>;
}

export function MaterialCategoriesTableSection({
  table,
}: MaterialCategoriesTableSectionProps) {
  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <DataTable table={table} />
    </div>
  );
}
