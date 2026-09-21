"use client";

import { useGetInboundNote } from "@/features/inbound-note";
import { InboundPrintDocument } from "../_components/print/inbound-print-document";
import { PrintDialog } from "../_components/print/print-dialog";

interface InboundNotePrintDialogProps {
  noteId: number | null;
  onClose: () => void;
}

/** Dialog in phiếu nhập — open đồng bộ với noteId (đóng = noteId null). */
export function InboundNotePrintDialog({
  noteId,
  onClose,
}: InboundNotePrintDialogProps) {
  const { data: note, isPending } = useGetInboundNote(noteId ?? 0, {
    enabled: noteId !== null,
  });

  return (
    <PrintDialog
      open={noteId !== null}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      title={note ? `Phiếu nhập — ${note.number}` : "Phiếu nhập"}
      isLoading={isPending}
    >
      {note ? <InboundPrintDocument note={note} /> : null}
    </PrintDialog>
  );
}
