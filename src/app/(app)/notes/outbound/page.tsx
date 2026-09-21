"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { toast } from "@/components/ui/toast";
import {
  type OutboundNote,
  useDeleteOutboundNote,
  useFinalizeOutboundNote,
  useGetOutboundNotes,
} from "@/features/outbound-note";
import {
  type ExportColumn,
  excelFileName,
  exportRowsToXlsx,
} from "@/utils/export";
import { createColumns } from "./columns";
import { CreateOutboundNoteDialog } from "./create-dialog";
import { OutboundNoteDetailExpanded } from "./detail-expanded";
import { EditOutboundNoteDialog } from "./edit-dialog";
import { OutboundNotesFilterBar } from "./filter-bar";
import { OutboundNotesFooter } from "./footer";
import { OutboundNotesHeader } from "./header";
import { OutboundNotePrintDialog } from "./print-dialog";
import { OutboundNotesTableSection } from "./table-section";
import { useOutboundNoteParams } from "./use-outbound-note-params";
import { VoidOutboundNoteDialog } from "./void-dialog";

const EXPORT_COLUMNS: ExportColumn<OutboundNote>[] = [
  { header: "Số phiếu", accessor: (row) => row.number },
  { header: "Ngày", accessor: (row) => row.date },
  { header: "Loại", accessor: (row) => row.noteTypeLabel },
  { header: "Kho xuất", accessor: (row) => row.warehouse.name },
  {
    header: "Kho nhận / CT",
    accessor: (row) => row.toWarehouse?.name ?? row.site?.name ?? "",
  },
  { header: "Số lượng", accessor: (row) => row.totalQuantity },
  { header: "Người lập", accessor: (row) => row.createdBy.email },
  { header: "Trạng thái", accessor: (row) => row.statusLabel },
];

export default function OutboundNotesPage() {
  const {
    params,
    search,
    setNoteType,
    setWarehouse,
    setToWarehouse,
    setSite,
    setDateFrom,
    setDateTo,
    setSearch,
    setPage,
  } = useOutboundNoteParams();

  const { data, isFetching, isPlaceholderData } = useGetOutboundNotes(params);
  const items = data?.items ?? [];
  const meta = data?.meta;

  const [createOpen, setCreateOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [printingNoteId, setPrintingNoteId] = useState<number | null>(null);
  const [voidingNote, setVoidingNote] = useState<OutboundNote | null>(null);
  const [finalizingNote, setFinalizingNote] = useState<OutboundNote | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<OutboundNote | null>(null);

  const { mutateAsync: deleteNote, isPending: isDeleting } =
    useDeleteOutboundNote();
  const { mutateAsync: finalizeNote, isPending: isFinalizing } =
    useFinalizeOutboundNote(finalizingNote?.id ?? 0);

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
      <OutboundNotesHeader
        total={meta?.total ?? 0}
        onAdd={() => setCreateOpen(true)}
        onExport={() =>
          exportRowsToXlsx({
            fileName: excelFileName("phieu-xuat", meta?.page ?? 1),
            sheetName: "Phiếu xuất",
            columns: EXPORT_COLUMNS,
            rows: items,
          })
        }
      />
      <OutboundNotesFilterBar
        noteTypeFilter={params.noteType}
        onNoteTypeChange={setNoteType}
        warehouseFilter={params.warehouse}
        onWarehouseChange={setWarehouse}
        toWarehouseFilter={params.toWarehouse}
        onToWarehouseChange={setToWarehouse}
        siteFilter={params.site}
        onSiteChange={setSite}
        dateFrom={params.dateFrom ?? ""}
        onDateFromChange={setDateFrom}
        dateTo={params.dateTo ?? ""}
        onDateToChange={setDateTo}
        search={search}
        onSearchChange={setSearch}
      />
      <OutboundNotesTableSection
        table={table}
        isRefreshing={isFetching && isPlaceholderData}
        isLoading={isFetching && !data}
        renderExpandedRow={(row) => (
          <OutboundNoteDetailExpanded noteId={row.original.id} />
        )}
      />
      <OutboundNotesFooter
        page={meta?.page ?? 1}
        pageSize={meta?.pageSize ?? 20}
        total={meta?.total ?? 0}
        hasNextPage={meta?.hasNextPage ?? false}
        hasPreviousPage={meta?.hasPreviousPage ?? false}
        onPageChange={setPage}
      />

      <CreateOutboundNoteDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      <OutboundNotePrintDialog
        noteId={printingNoteId}
        onClose={() => setPrintingNoteId(null)}
      />

      <EditOutboundNoteDialog
        noteId={editingNoteId}
        onClose={() => setEditingNoteId(null)}
      />

      <VoidOutboundNoteDialog
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
              và lập lại. Tồn kho sẽ trừ ngay lập tức — chặn tồn âm.
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
