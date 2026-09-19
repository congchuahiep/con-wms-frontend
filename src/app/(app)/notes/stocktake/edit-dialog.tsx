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
  type StocktakeNoteDetail,
  toStocktakeNoteInput,
  useGetStocktakeNote,
  useUpdateStocktakeNote,
} from "@/features/stocktake";
import { NoteForm } from "./note-form";

interface EditStocktakeNoteDialogProps {
  noteId: number | null;
  onClose: () => void;
}

export function EditStocktakeNoteDialog({
  noteId,
  onClose,
}: EditStocktakeNoteDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (noteId !== null) setOpen(true);
  }, [noteId]);

  const { data: note } = useGetStocktakeNote(noteId ?? 0, {
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
  note: StocktakeNoteDetail;
  onClose: () => void;
}) {
  const initialInput = useMemo(() => toStocktakeNoteInput(note), [note]);
  const initialMaterials = useMemo(
    () => note.lines.map((line) => line.material),
    [note],
  );

  const { form, handleSubmit, isPending } = useUpdateStocktakeNote(
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
