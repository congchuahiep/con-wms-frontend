"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type OutboundNoteDetail,
  toOutboundNoteInput,
  useGetOutboundNote,
  useUpdateOutboundNote,
} from "@/features/outbound-note";
import { NoteForm } from "./note-form";

interface EditOutboundNoteDialogProps {
  noteId: number | null;
  onClose: () => void;
}

export function EditOutboundNoteDialog({
  noteId,
  onClose,
}: EditOutboundNoteDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (noteId !== null) setOpen(true);
  }, [noteId]);

  const { data: note } = useGetOutboundNote(noteId ?? 0, {
    enabled: noteId !== null,
  });

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Sửa phiếu {note?.number ?? ""}</DialogTitle>
          <DialogDescription>
            Các dòng cũ sẽ được thay thế bằng danh sách dòng mới.
          </DialogDescription>
        </DialogHeader>
        {note && note.status === "draft" && (
          <EditNoteForm note={note} onClose={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditNoteForm({
  note,
  onClose,
}: {
  note: OutboundNoteDetail;
  onClose: () => void;
}) {
  const initialInput = useMemo(() => toOutboundNoteInput(note), [note]);
  const initialMaterials = useMemo(
    () => note.lines.map((line) => line.material),
    [note],
  );

  const { form, handleSubmit, isPending } = useUpdateOutboundNote(
    note.id,
    initialInput,
    { onSuccess: onClose },
  );

  return (
    <NoteForm
      form={form}
      onSubmit={handleSubmit}
      isPending={isPending}
      submitLabel="Lưu thay đổi"
      onCancel={onClose}
      initialMaterials={initialMaterials}
    />
  );
}
