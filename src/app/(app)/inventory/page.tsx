"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { CreateInboundNoteDialog } from "@/app/(app)/notes/inbound/create-dialog";
import type { StockBalanceSummary } from "@/features/stock";
import { aggregateStockBalances, useGetStockBalances } from "@/features/stock";
import {
  type ExportColumn,
  excelFileName,
  exportRowsToXlsx,
} from "@/utils/export";
import { columns } from "./columns";
import { InventoryDetailExpanded } from "./detail-expanded";
import { InventoryFilterBar } from "./filter-bar";
import { InventoryFooter } from "./footer";
import { InventoryHeader } from "./header";
import { InventoryTableSection } from "./table-section";
import { useStockParams } from "./use-stock-params";

const EXPORT_COLUMNS: ExportColumn<StockBalanceSummary>[] = [
  { header: "Mã", accessor: (row) => row.material.code },
  { header: "Tên vật tư", accessor: (row) => row.material.name },
  {
    header: "Các kho",
    accessor: (row) =>
      row.warehouseBalances.map((w) => w.warehouse.name).join(", "),
  },
  { header: "Tồn kho", accessor: (row) => Number(row.totalQuantity) },
  { header: "ĐVT", accessor: (row) => row.unit.code },
  {
    header: "Giá nhập gần nhất",
    accessor: (row) =>
      row.lastPurchasePrice === null ? "" : Number(row.lastPurchasePrice),
  },
  {
    header: "Giá trị tồn",
    accessor: (row) =>
      row.totalStockValue === null ? "" : Number(row.totalStockValue),
  },
];

export default function InventoryPage() {
  const { params, search, setSearch, setCategory, setStockStatus } =
    useStockParams();

  const [createOpen, setCreateOpen] = useState(false);

  const {
    data: balances = [],
    isFetching,
    isPlaceholderData,
  } = useGetStockBalances(params);

  // Backend trả theo (warehouse, material) → gộp theo vật tư: mỗi dòng là
  // tổng tồn ở mọi kho, kèm danh sách kho đang giữ hàng.
  const items = useMemo(() => aggregateStockBalances(balances), [balances]);

  const totalValue = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + (item.totalStockValue ? Number(item.totalStockValue) : 0),
        0,
      ),
    [items],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowCanExpand: () => true,
  });

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <InventoryHeader
        totalRows={items.length}
        totalValue={totalValue}
        onCreateNote={() => setCreateOpen(true)}
        onExport={() =>
          exportRowsToXlsx({
            fileName: excelFileName("ton-kho"),
            sheetName: "Tồn kho",
            columns: EXPORT_COLUMNS,
            rows: items,
          })
        }
      />
      <InventoryFilterBar
        categoryFilter={params.category ?? null}
        onCategoryChange={setCategory}
        stockStatus={params.hasStock ? "inStock" : "all"}
        onStockStatusChange={setStockStatus}
        search={search}
        onSearchChange={setSearch}
      />
      <InventoryTableSection
        table={table}
        isRefreshing={isFetching && isPlaceholderData}
        renderExpandedRow={(row) => (
          <InventoryDetailExpanded summary={row.original} />
        )}
      />
      <InventoryFooter totalRows={items.length} totalValue={totalValue} />

      <CreateInboundNoteDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
