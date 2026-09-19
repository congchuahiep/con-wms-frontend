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
import { type OutboundNote, useVoidOutboundNote } from "@/features/outbound-note";

interface VoidOutboundNoteDialogProps {
  note: OutboundNote | null;
  onClose: () => void;
}

export function VoidOutboundNoteDialog({
  note,
  onClose,
}: VoidOutboundNoteDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (note) setOpen(true);
  }, [note]);

  const { form, handleSubmit, isPending } = useVoidOutboundNote(note?.id ?? 0, {
    onSuccess: () => {
      toast.add({
        type: "success",
        title: "Đã hủy phiếu",
        description: "Tồn kho đã được đảo dấu cho cả 2 đầu (nếu điều chuyển).",
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
                {note.noteType === "transfer" && (
                  <> Hệ thống sẽ đảo dấu tồn ở cả kho xuất và kho đích.</>
                )}
              </div>
            </Alert>

            <TextareaField
              of={form}
              path={["reason"]}
              label="Lý do hủy"
              placeholder="VD: Xuất sai số lượng, công trường báo thừa"
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
