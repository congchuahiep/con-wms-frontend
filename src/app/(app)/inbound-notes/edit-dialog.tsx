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
  type InboundNoteDetail,
  toInboundNoteInput,
  useGetInboundNote,
  useUpdateInboundNote,
} from "@/features/inbound-note";
import { NoteForm } from "./note-form";

interface EditInboundNoteDialogProps {
  noteId: number | null;
  onClose: () => void;
}

export function EditInboundNoteDialog({
  noteId,
  onClose,
}: EditInboundNoteDialogProps) {
  // Dialog tự quản lý open nội bộ — chỉ gọi onClose sau khi animation đóng hoàn tất
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (noteId !== null) setOpen(true);
  }, [noteId]);

  // List không kèm lines → fetch detail khi mở (chỉ cho phiếu draft)
  const { data: note } = useGetInboundNote(noteId ?? 0, {
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
      <DialogContent className="w-3xl">
        <DialogHeader>
          <DialogTitle>Sửa phiếu {note?.number ?? ""}</DialogTitle>
          <DialogDescription>
            Các dòng cũ sẽ được thay thế bằng danh sách dòng mới.
          </DialogDescription>
        </DialogHeader>
        {/* Pre-fill pattern: form chỉ mount khi detail đã có */}
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
  note: InboundNoteDetail;
  onClose: () => void;
}) {
  const initialInput = useMemo(() => toInboundNoteInput(note), [note]);
  const initialMaterials = useMemo(
    () => note.lines.map((line) => line.material),
    [note],
  );

  const { form, handleSubmit, isPending } = useUpdateInboundNote(
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
