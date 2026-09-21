"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { toast } from "@/components/ui/toast";
import {
  type StocktakeNote,
  useDeleteStocktakeNote,
  useFinalizeStocktakeNote,
  useGetStocktakeNotes,
} from "@/features/stocktake";
import { createColumns } from "./columns";
import { CreateStocktakeNoteDialog } from "./create-dialog";
import { StocktakeNoteDetailExpanded } from "./detail-expanded";
import { EditStocktakeNoteDialog } from "./edit-dialog";
import { StocktakeNotesFilterBar } from "./filter-bar";
import { StocktakeNotesFooter } from "./footer";
import { StocktakeNotesHeader } from "./header";
import { StocktakeNotePrintDialog } from "./print-dialog";
import { StocktakeNotesTableSection } from "./table-section";
import { useStocktakeNoteParams } from "./use-stocktake-note-params";
import { VoidStocktakeNoteDialog } from "./void-dialog";

export default function StocktakeNotesPage() {
  const {
    params,
    search,
    setWarehouse,
    setDateFrom,
    setDateTo,
    setSearch,
    setPage,
  } = useStocktakeNoteParams();

  const { data, isFetching, isPlaceholderData } = useGetStocktakeNotes(params);
  const items = data?.items ?? [];
  const meta = data?.meta;

  const [createOpen, setCreateOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [printingNoteId, setPrintingNoteId] = useState<number | null>(null);
  const [voidingNote, setVoidingNote] = useState<StocktakeNote | null>(null);
  const [finalizingNote, setFinalizingNote] = useState<StocktakeNote | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<StocktakeNote | null>(null);

  const { mutateAsync: deleteNote, isPending: isDeleting } =
    useDeleteStocktakeNote();
  const { mutateAsync: finalizeNote, isPending: isFinalizing } =
    useFinalizeStocktakeNote(finalizingNote?.id ?? 0);

  // Prefill khi mở từ trang Công trường (?warehouseId=...)
  const searchParams = useSearchParams();
  const createPrefill = useMemo(() => {
    const raw = searchParams.get("warehouseId");
    const n = raw ? Number(raw) : Number.NaN;
    return Number.isInteger(n) && n > 0 ? { warehouseId: n } : undefined;
  }, [searchParams]);

  // Đến với prefill (từ trang Công trường) → tự mở dialog tạo phiếu 1 lần
  const didAutoOpenRef = useRef(false);
  useEffect(() => {
    if (createPrefill && !didAutoOpenRef.current) {
      didAutoOpenRef.current = true;
      setCreateOpen(true);
    }
  }, [createPrefill]);

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
      <StocktakeNotesHeader
        total={meta?.total ?? 0}
        onAdd={() => setCreateOpen(true)}
      />
      <StocktakeNotesFilterBar
        warehouseFilter={params.warehouse}
        onWarehouseChange={setWarehouse}
        dateFrom={params.dateFrom ?? ""}
        onDateFromChange={setDateFrom}
        dateTo={params.dateTo ?? ""}
        onDateToChange={setDateTo}
        search={search}
        onSearchChange={setSearch}
      />
      <StocktakeNotesTableSection
        table={table}
        isRefreshing={isFetching && isPlaceholderData}
        isLoading={isFetching && !data}
        renderExpandedRow={(row) => (
          <StocktakeNoteDetailExpanded noteId={row.original.id} />
        )}
      />
      <StocktakeNotesFooter
        page={meta?.page ?? 1}
        pageSize={meta?.pageSize ?? 20}
        total={meta?.total ?? 0}
        hasNextPage={meta?.hasNextPage ?? false}
        hasPreviousPage={meta?.hasPreviousPage ?? false}
        onPageChange={setPage}
      />

      <CreateStocktakeNoteDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      <StocktakeNotePrintDialog
        noteId={printingNoteId}
        onClose={() => setPrintingNoteId(null)}
      />

      <EditStocktakeNoteDialog
        noteId={editingNoteId}
        onClose={() => setEditingNoteId(null)}
      />

      <VoidStocktakeNoteDialog
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
              và lập lại. Tồn kho sẽ điều chỉnh theo chênh lệch ngay lập tức.
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
            description: "Tồn kho đã được điều chỉnh.",
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
