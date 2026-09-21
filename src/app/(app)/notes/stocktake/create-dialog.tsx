"use client";

import type { DeepPartial } from "@formisch/react";
import type * as v from "valibot";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type StocktakeNoteSchema,
  useAddStocktakeNote,
} from "@/features/stocktake";
import { NoteForm } from "./note-form";

interface CreateStocktakeNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Prefill một phần form — vd: `warehouseId` = kho công trường khi mở từ trang Công trường. */
  initialInput?: DeepPartial<v.InferInput<typeof StocktakeNoteSchema>>;
}

export function CreateStocktakeNoteDialog({
  open,
  onOpenChange,
  initialInput,
}: CreateStocktakeNoteDialogProps) {
  const { form, handleSubmit, isPending, resetForm } = useAddStocktakeNote({
    initialInput,
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
            Phiếu được lưu dạng nháp — chốt phiếu để ghi điều chỉnh tồn kho.
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
