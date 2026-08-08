"use client";

import { Form } from "@formisch/react";
import { InputField } from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddUnit } from "@/features/unit";

interface CreateUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUnitDialog({
  open,
  onOpenChange,
}: CreateUnitDialogProps) {
  const { form, handleSubmit, isPending, resetForm } = useAddUnit({
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(open) => {
        if (!open) {
          resetForm();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm đơn vị tính</DialogTitle>
          <DialogDescription>Tạo đơn vị tính mới</DialogDescription>
        </DialogHeader>

        <Form of={form} onSubmit={handleSubmit} className="space-y-4">
          <InputField
            of={form}
            path={["code"]}
            label="Mã đơn vị"
            placeholder="VD: KG"
            required
          />

          <InputField
            of={form}
            path={["name"]}
            label="Tên đơn vị"
            placeholder="Kilogram"
            required
          />

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang tạo..." : "Thêm đơn vị"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
