"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useGetStockMovements } from "@/features/stock";
import { columns } from "./columns";
import { StockMovementsFilterBar } from "./filter-bar";
import { StockMovementsFooter } from "./footer";
import { StockMovementsHeader } from "./header";
import { StockMovementsTableSection } from "./table-section";
import { useStockMovementParams } from "./use-stock-movement-params";

export default function StockMovementsPage() {
  const {
    params,
    setWarehouse,
    setMovementType,
    setMaterial,
    setDateFrom,
    setDateTo,
    setShowReversals,
    setPage,
  } = useStockMovementParams();

  const { data, isFetching, isPlaceholderData } = useGetStockMovements(params);

  const items = data?.items ?? [];
  const meta = data?.meta;

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <StockMovementsHeader total={meta?.total ?? 0} />
      <StockMovementsFilterBar
        warehouseFilter={params.warehouse ?? null}
        onWarehouseChange={setWarehouse}
        movementTypeFilter={params.movementType ?? null}
        onMovementTypeChange={setMovementType}
        materialFilter={params.material ?? null}
        onMaterialChange={setMaterial}
        dateFrom={params.dateFrom ?? ""}
        onDateFromChange={setDateFrom}
        dateTo={params.dateTo ?? ""}
        onDateToChange={setDateTo}
        showReversals={params.originalsOnly === false}
        onShowReversalsChange={setShowReversals}
      />
      <StockMovementsTableSection
        table={table}
        isRefreshing={isFetching && isPlaceholderData}
      />
      <StockMovementsFooter
        page={meta?.page ?? 1}
        pageSize={meta?.pageSize ?? 50}
        total={meta?.total ?? 0}
        hasNextPage={meta?.hasNextPage ?? false}
        hasPreviousPage={meta?.hasPreviousPage ?? false}
        onPageChange={setPage}
      />
    </div>
  );
}
