"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { type StockMovement, useGetStockMovements } from "@/features/stock";
import {
  type ExportColumn,
  excelFileName,
  exportRowsToXlsx,
} from "@/utils/export";
import { columns } from "./columns";
import { StockMovementsFilterBar } from "./filter-bar";
import { StockMovementsFooter } from "./footer";
import { StockMovementsHeader } from "./header";
import { StockMovementsTableSection } from "./table-section";
import { useStockMovementParams } from "./use-stock-movement-params";

const EXPORT_COLUMNS: ExportColumn<StockMovement>[] = [
  { header: "Ngày", accessor: (row) => row.date },
  { header: "Loại", accessor: (row) => row.movementTypeLabel },
  { header: "Mã vật tư", accessor: (row) => row.material.code },
  { header: "Tên vật tư", accessor: (row) => row.material.name },
  { header: "Kho", accessor: (row) => row.warehouse.name },
  {
    header: "Đơn giá",
    accessor: (row) => (row.unitPrice === null ? "" : Number(row.unitPrice)),
  },
  { header: "Số lượng", accessor: (row) => Number(row.quantity) },
  {
    header: "Thành tiền",
    accessor: (row) =>
      row.unitPrice === null
        ? ""
        : Number(row.quantity) * Number(row.unitPrice),
  },
  { header: "Phiếu", accessor: (row) => row.sourceNote?.number ?? "" },
  { header: "Lý do", accessor: (row) => row.reason || "" },
  { header: "Người tạo", accessor: (row) => row.createdBy.email },
  { header: "Thời điểm tạo", accessor: (row) => row.createdAt },
];

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
      <StockMovementsHeader
        total={meta?.total ?? 0}
        onExport={() =>
          exportRowsToXlsx({
            fileName: excelFileName("so-kho", meta?.page ?? 1),
            sheetName: "Sổ kho",
            columns: EXPORT_COLUMNS,
            rows: items,
          })
        }
      />
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
