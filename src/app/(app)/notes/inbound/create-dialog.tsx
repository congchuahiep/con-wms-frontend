"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddInboundNote } from "@/features/inbound-note";
import { NoteForm } from "./note-form";

interface CreateInboundNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInboundNoteDialog({
  open,
  onOpenChange,
}: CreateInboundNoteDialogProps) {
  const { form, handleSubmit, isPending, resetForm } = useAddInboundNote({
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
          <DialogTitle>Tạo phiếu nhập</DialogTitle>
          <DialogDescription>
            Phiếu được lưu dạng nháp — chốt phiếu để nhập kho.
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
