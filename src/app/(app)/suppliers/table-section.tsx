"use client";

import type { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { Supplier } from "@/features/supplier";

interface SuppliersTableSectionProps {
  table: Table<Supplier>;
}

export function SuppliersTableSection({ table }: SuppliersTableSectionProps) {
  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <DataTable table={table} />
    </div>
  );
}
