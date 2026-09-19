"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddOutboundNote } from "@/features/outbound-note";
import { NoteForm } from "./note-form";

interface CreateOutboundNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateOutboundNoteDialog({
  open,
  onOpenChange,
}: CreateOutboundNoteDialogProps) {
  const { form, handleSubmit, isPending, resetForm } = useAddOutboundNote({
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(next) => {
        if (!next) resetForm();
      }}
    >
      <DialogContent className="w-xl">
        <DialogHeader>
          <DialogTitle>Tạo phiếu xuất</DialogTitle>
          <DialogDescription>
            Phiếu được lưu dạng nháp — chốt phiếu để xuất kho.
          </DialogDescription>
        </DialogHeader>

        <NoteForm
          form={form}
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel="Lưu phiếu nháp"
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
