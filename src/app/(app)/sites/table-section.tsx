"use client";

import type { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { Site } from "@/features/site";

interface SitesTableSectionProps {
  table: Table<Site>;
}

export function SitesTableSection({ table }: SitesTableSectionProps) {
  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <DataTable table={table} />
    </div>
  );
}
