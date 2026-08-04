"use client";

import type { Table } from "@tanstack/react-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import type { InventoryRow } from "@/lib/mock/data";

interface InventoryFooterProps {
  table: Table<InventoryRow>;
}

export function InventoryFooter({ table }: InventoryFooterProps) {
  return (
    <footer className="shrink-0 border-t px-6 py-3">
      <DataTablePagination table={table} />
    </footer>
  );
}
