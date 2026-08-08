"use client";

import type { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { Unit } from "@/features/unit";

interface UnitsTableSectionProps {
  table: Table<Unit>;
}

export function UnitsTableSection({ table }: UnitsTableSectionProps) {
  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <DataTable table={table} />
    </div>
  );
}
