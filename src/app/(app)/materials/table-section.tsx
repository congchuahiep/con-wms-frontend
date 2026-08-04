"use client";

import type { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { Material } from "@/lib/mock/data";

interface MaterialsTableSectionProps {
  table: Table<Material>;
}

export function MaterialsTableSection({ table }: MaterialsTableSectionProps) {
  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <DataTable table={table} />
    </div>
  );
}
