"use client";

import { Form, reset } from "@formisch/react";
import { useEffect, useState } from "react";
import { InputField } from "@/components/form/InputField";
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
import { ValidationError } from "@/errors";
import { type Unit, useUpdateUnit } from "@/features/unit";

interface EditUnitDialogProps {
  unit: Unit | null;
  onClose: () => void;
}

export function EditUnitDialog({ unit, onClose }: EditUnitDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (unit) setOpen(true);
  }, [unit]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        {unit && (
          <EditUnitFormContent
            unit={unit}
            onClose={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface EditUnitFormContentProps {
  unit: Unit;
  onClose: () => void;
}

function EditUnitFormContent({ unit, onClose }: EditUnitFormContentProps) {
  const { form, handleSubmit, isPending, isDirty, error } = useUpdateUnit(
    unit.id,
    {
      code: unit.code,
      name: unit.name,
    },
    {
      onSuccess: (data) => {
        toast.add({
          title: "Thành công",
          description: "Đơn vị đã được cập nhật",
        });
        reset(form, {
          initialInput: {
            code: data.code,
            name: data.name,
          },
        });
      },
    },
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sửa đơn vị tính</DialogTitle>
        <DialogDescription>
          Chỉnh sửa thông tin đơn vị &quot;{unit.name}&quot;
        </DialogDescription>
      </DialogHeader>

      <Form of={form} onSubmit={handleSubmit} className="space-y-4">
        {error && !(error instanceof ValidationError) && (
          <Alert>Lỗi: {error.message}</Alert>
        )}

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
          <Button variant="outline" type="button" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={!isDirty || isPending}>
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </Form>
    </>
  );
}
