"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { toast } from "@/components/ui/toast";
import {
  type InboundNote,
  useDeleteInboundNote,
  useFinalizeInboundNote,
  useGetInboundNotes,
} from "@/features/inbound-note";
import {
  type ExportColumn,
  excelFileName,
  exportRowsToXlsx,
} from "@/utils/export";
import { createColumns } from "./columns";
import { CreateInboundNoteDialog } from "./create-dialog";
import { InboundNoteDetailExpanded } from "./detail-expanded";
import { EditInboundNoteDialog } from "./edit-dialog";
import { InboundNotesFilterBar } from "./filter-bar";
import { InboundNotesFooter } from "./footer";
import { InboundNotesHeader } from "./header";
import { InboundNotePrintDialog } from "./print-dialog";
import { InboundNotesTableSection } from "./table-section";
import { useInboundNoteParams } from "./use-inbound-note-params";
import { VoidInboundNoteDialog } from "./void-dialog";

const EXPORT_COLUMNS: ExportColumn<InboundNote>[] = [
  { header: "Số phiếu", accessor: (row) => row.number },
  { header: "Ngày", accessor: (row) => row.date },
  { header: "Loại", accessor: (row) => row.noteTypeLabel },
  { header: "Kho", accessor: (row) => row.warehouse.name },
  { header: "NCC", accessor: (row) => row.supplier?.name ?? "" },
  { header: "Số loại hàng", accessor: (row) => row.totalQuantity },
  { header: "Thành tiền", accessor: (row) => Number(row.totalAmount) },
  { header: "Người lập", accessor: (row) => row.createdBy.email },
  { header: "Trạng thái", accessor: (row) => row.statusLabel },
];

export default function InboundNotesPage() {
  const {
    params,
    search,
    setNoteType,
    setWarehouse,
    setSupplier,
    setDateFrom,
    setDateTo,
    setSearch,
    setPage,
  } = useInboundNoteParams();

  const { data, isFetching, isPlaceholderData } = useGetInboundNotes(params);
  const items = data?.items ?? [];
  const meta = data?.meta;

  const [createOpen, setCreateOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [printingNoteId, setPrintingNoteId] = useState<number | null>(null);
  const [voidingNote, setVoidingNote] = useState<InboundNote | null>(null);
  const [finalizingNote, setFinalizingNote] = useState<InboundNote | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<InboundNote | null>(null);

  const { mutateAsync: deleteNote, isPending: isDeleting } =
    useDeleteInboundNote();
  const { mutateAsync: finalizeNote, isPending: isFinalizing } =
    useFinalizeInboundNote(finalizingNote?.id ?? 0);

  const tableColumns = useMemo(
    () =>
      createColumns({
        onEdit: (note) => setEditingNoteId(note.id),
        onDelete: setDeleteTarget,
        onFinalize: setFinalizingNote,
        onVoid: setVoidingNote,
        onPrint: (note) => setPrintingNoteId(note.id),
      }),
    [],
  );

  const table = useReactTable({
    data: items,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowCanExpand: () => true,
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <InboundNotesHeader
        total={meta?.total ?? 0}
        onAdd={() => setCreateOpen(true)}
        onExport={() =>
          exportRowsToXlsx({
            fileName: excelFileName("phieu-nhap", meta?.page ?? 1),
            sheetName: "Phiếu nhập",
            columns: EXPORT_COLUMNS,
            rows: items,
          })
        }
      />
      <InboundNotesFilterBar
        noteTypeFilter={params.noteType}
        onNoteTypeChange={setNoteType}
        warehouseFilter={params.warehouse}
        onWarehouseChange={setWarehouse}
        supplierFilter={params.supplier}
        onSupplierChange={setSupplier}
        dateFrom={params.dateFrom ?? ""}
        onDateFromChange={setDateFrom}
        dateTo={params.dateTo ?? ""}
        onDateToChange={setDateTo}
        search={search}
        onSearchChange={setSearch}
      />
      <InboundNotesTableSection
        table={table}
        isRefreshing={isFetching && isPlaceholderData}
        isLoading={isFetching && !data}
        renderExpandedRow={(row) => (
          <InboundNoteDetailExpanded noteId={row.original.id} />
        )}
      />
      <InboundNotesFooter
        page={meta?.page ?? 1}
        pageSize={meta?.pageSize ?? 20}
        total={meta?.total ?? 0}
        hasNextPage={meta?.hasNextPage ?? false}
        hasPreviousPage={meta?.hasPreviousPage ?? false}
        onPageChange={setPage}
      />

      <CreateInboundNoteDialog open={createOpen} onOpenChange={setCreateOpen} />

      <InboundNotePrintDialog
        noteId={printingNoteId}
        onClose={() => setPrintingNoteId(null)}
      />

      <EditInboundNoteDialog
        noteId={editingNoteId}
        onClose={() => setEditingNoteId(null)}
      />

      <VoidInboundNoteDialog
        note={voidingNote}
        onClose={() => setVoidingNote(null)}
      />

      <ConfirmDialog
        open={finalizingNote !== null}
        onOpenChange={(open) => {
          if (!open) setFinalizingNote(null);
        }}
        title="Chốt phiếu"
        description={
          finalizingNote ? (
            <>
              Chốt phiếu <code>{finalizingNote.number}</code>? Sau khi chốt,
              phiếu <strong>không thể sửa/xóa</strong> — sai sót phải hủy phiếu
              và lập lại. Tồn kho sẽ tăng ngay lập tức.
            </>
          ) : (
            ""
          )
        }
        confirmLabel="Chốt phiếu"
        isPending={isFinalizing}
        onConfirm={async () => {
          if (!finalizingNote) return;
          await finalizeNote(undefined);
          toast.add({
            type: "success",
            title: "Đã chốt phiếu",
            description: "Tồn kho đã được cập nhật.",
          });
          setFinalizingNote(null);
        }}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Xóa phiếu nháp"
        description={
          deleteTarget ? (
            <>
              Xóa phiếu nháp <strong>&quot;{deleteTarget.number}&quot;</strong>?
              Phiếu nháp chưa ảnh hưởng tồn kho nên xóa được hoàn toàn.
            </>
          ) : (
            ""
          )
        }
        onConfirm={async () => {
          if (deleteTarget) await deleteNote(deleteTarget.id);
        }}
        isPending={isDeleting}
      />
    </div>
  );
}
