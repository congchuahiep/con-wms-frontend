"use client";

import { useGetOutboundNote } from "@/features/outbound-note";
import { OutboundPrintDocument } from "../_components/print/outbound-print-document";
import { PrintDialog } from "../_components/print/print-dialog";

interface OutboundNotePrintDialogProps {
  noteId: number | null;
  onClose: () => void;
}

/** Dialog in phiếu xuất — open đồng bộ với noteId (đóng = noteId null). */
export function OutboundNotePrintDialog({
  noteId,
  onClose,
}: OutboundNotePrintDialogProps) {
  const { data: note, isPending } = useGetOutboundNote(noteId ?? 0, {
    enabled: noteId !== null,
  });

  return (
    <PrintDialog
      open={noteId !== null}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      title={note ? `Phiếu xuất — ${note.number}` : "Phiếu xuất"}
      isLoading={isPending}
    >
      {note ? <OutboundPrintDocument note={note} /> : null}
    </PrintDialog>
  );
}
