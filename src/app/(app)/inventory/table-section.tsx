"use client";

import type { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { InventoryRow } from "@/lib/mock/data";

interface InventoryTableSectionProps {
  table: Table<InventoryRow>;
}

export function InventoryTableSection({ table }: InventoryTableSectionProps) {
  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <DataTable table={table} />
    </div>
  );
}
