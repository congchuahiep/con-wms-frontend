"use client";

import { Form } from "@formisch/react";
import { useEffect, useState } from "react";
import { TextareaField } from "@/components/form/TextareaField";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { type InboundNote, useVoidInboundNote } from "@/features/inbound-note";

interface VoidInboundNoteDialogProps {
  note: InboundNote | null;
  onClose: () => void;
}

export function VoidInboundNoteDialog({
  note,
  onClose,
}: VoidInboundNoteDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (note) setOpen(true);
  }, [note]);

  const { form, handleSubmit, isPending } = useVoidInboundNote(note?.id ?? 0, {
    onSuccess: () => {
      toast.add({
        type: "success",
        title: "Đã hủy phiếu",
        description: "Tồn kho đã được trừ ngược lại.",
      });
      setOpen(false);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hủy phiếu {note?.number ?? ""}</DialogTitle>
          <DialogDescription>
            Phiếu sẽ bị hủy vĩnh viễn — hệ thống ghi dòng sổ kho ngược dấu, tồn
            kho trở về như trước.
          </DialogDescription>
        </DialogHeader>

        {note && (
          <Form of={form} onSubmit={handleSubmit} className="space-y-4">
            <Alert>
              <div className="text-sm">
                Hủy phiếu <span className="font-mono">{note.number}</span> — bắt
                buộc nhập lý do để kế toán đối chiếu.
              </div>
            </Alert>

            <TextareaField
              of={form}
              path={["reason"]}
              label="Lý do hủy"
              placeholder="VD: Nhập sai số lượng, NCC giao thiếu"
              required
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Đóng
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending ? "Đang hủy..." : "Hủy phiếu"}
              </Button>
            </DialogFooter>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
