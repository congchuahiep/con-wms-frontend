"use client";

import { useGetStocktakeNote } from "@/features/stocktake";
import { PrintDialog } from "../_components/print/print-dialog";
import { StocktakePrintDocument } from "../_components/print/stocktake-print-document";

interface StocktakeNotePrintDialogProps {
  noteId: number | null;
  onClose: () => void;
}

/** Dialog in phiếu kiểm kê — open đồng bộ với noteId (đóng = noteId null). */
export function StocktakeNotePrintDialog({
  noteId,
  onClose,
}: StocktakeNotePrintDialogProps) {
  const { data: note, isPending } = useGetStocktakeNote(noteId ?? 0, {
    enabled: noteId !== null,
  });

  return (
    <PrintDialog
      open={noteId !== null}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      title={note ? `Phiếu kiểm kê — ${note.number}` : "Phiếu kiểm kê"}
      isLoading={isPending}
    >
      {note ? <StocktakePrintDocument note={note} /> : null}
    </PrintDialog>
  );
}
