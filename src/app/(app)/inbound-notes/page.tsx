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
import { createColumns } from "./columns";
import { CreateInboundNoteDialog } from "./create-dialog";
import { InboundNoteDetailExpanded } from "./detail-expanded";
import { EditInboundNoteDialog } from "./edit-dialog";
import { InboundNotesFilterBar } from "./filter-bar";
import { InboundNotesFooter } from "./footer";
import { InboundNotesHeader } from "./header";
import { InboundNotesTableSection } from "./table-section";
import { useInboundNoteParams } from "./use-inbound-note-params";
import { VoidInboundNoteDialog } from "./void-dialog";

export default function InboundNotesPage() {
  const {
    params,
    search,
    setStatus,
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
    <div className="flex h-full min-h-0 max-h-full flex-col">
      <InboundNotesHeader
        total={meta?.total ?? 0}
        onAdd={() => setCreateOpen(true)}
      />
      <InboundNotesFilterBar
        statusFilter={params.status ?? null}
        onStatusChange={setStatus}
        noteTypeFilter={params.noteType ?? null}
        onNoteTypeChange={setNoteType}
        warehouseFilter={params.warehouse ?? null}
        onWarehouseChange={setWarehouse}
        supplierFilter={params.supplier ?? null}
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
