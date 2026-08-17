"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { useGetStockBalances } from "@/features/stock";
import { columns } from "./columns";
import { InventoryFilterBar } from "./filter-bar";
import { InventoryFooter } from "./footer";
import { InventoryHeader } from "./header";
import { InventoryTableSection } from "./table-section";
import { useStockParams } from "./use-stock-params";

export default function InventoryPage() {
  const {
    params,
    search,
    setSearch,
    setWarehouse,
    setCategory,
    setStockStatus,
  } = useStockParams();

  const {
    data: items = [],
    isFetching,
    isPlaceholderData,
  } = useGetStockBalances(params);

  const totalValue = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.stockValue ? Number(item.stockValue) : 0),
        0,
      ),
    [items],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <InventoryHeader totalRows={items.length} totalValue={totalValue} />
      <InventoryFilterBar
        categoryFilter={params.category ?? null}
        onCategoryChange={setCategory}
        warehouseFilter={params.warehouse ?? null}
        onWarehouseChange={setWarehouse}
        stockStatus={params.hasStock ? "inStock" : "all"}
        onStockStatusChange={setStockStatus}
        search={search}
        onSearchChange={setSearch}
      />
      <InventoryTableSection
        table={table}
        isRefreshing={isFetching && isPlaceholderData}
      />
      <InventoryFooter totalRows={items.length} totalValue={totalValue} />
    </div>
  );
}
