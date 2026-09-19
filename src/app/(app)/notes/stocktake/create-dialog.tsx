"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddStocktakeNote } from "@/features/stocktake";
import { NoteForm } from "./note-form";

interface CreateStocktakeNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStocktakeNoteDialog({
  open,
  onOpenChange,
}: CreateStocktakeNoteDialogProps) {
  const { form, handleSubmit, isPending, resetForm } = useAddStocktakeNote({
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
          <DialogTitle>Tạo phiếu kiểm kê</DialogTitle>
          <DialogDescription>
            Phiếu được lưu dạng nháp - chốt phiếu để ghi điều chỉnh tồn kho.
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
