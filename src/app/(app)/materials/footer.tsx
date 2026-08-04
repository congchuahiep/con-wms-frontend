"use client";

import type { Table } from "@tanstack/react-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import type { Material } from "@/lib/mock/data";

interface MaterialsFooterProps {
  table: Table<Material>;
}

export function MaterialsFooter({ table }: MaterialsFooterProps) {
  return (
    <footer className="shrink-0 border-t px-6 py-3">
      <DataTablePagination table={table} />
    </footer>
  );
}
