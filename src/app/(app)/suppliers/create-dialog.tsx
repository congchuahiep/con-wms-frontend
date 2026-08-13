"use client";

import { Form } from "@formisch/react";
import { InputField } from "@/components/form/InputField";
import { TextareaField } from "@/components/form/TextareaField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddSupplier } from "@/features/supplier";

interface CreateSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSupplierDialog({
  open,
  onOpenChange,
}: CreateSupplierDialogProps) {
  const { form, handleSubmit, isPending, resetForm } = useAddSupplier({
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(open) => {
        if (!open) resetForm();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm nhà cung cấp</DialogTitle>
          <DialogDescription>Tạo nhà cung cấp mới</DialogDescription>
        </DialogHeader>

        <Form of={form} onSubmit={handleSubmit} className="space-y-4">
          <InputField
            of={form}
            path={["code"]}
            label="Mã NCC"
            placeholder="VD: NCC001"
            required
          />

          <InputField
            of={form}
            path={["name"]}
            label="Tên nhà cung cấp"
            placeholder="Công ty TNHH Vật Liệu Xây Dựng ABC"
            required
          />

          <InputField
            of={form}
            path={["taxCode"]}
            label="Mã số thuế"
            placeholder="0123456789"
          />

          <InputField
            of={form}
            path={["contactPerson"]}
            label="Người liên hệ"
            placeholder="Anh Tuấn — quản lý bán hàng"
          />

          <InputField
            of={form}
            path={["phone"]}
            label="SĐT"
            placeholder="0903123456"
          />

          <InputField
            of={form}
            path={["email"]}
            label="Email"
            placeholder="sales@abc-vlxd.com"
          />

          <TextareaField
            of={form}
            path={["address"]}
            label="Địa chỉ"
            placeholder="Số 45, đường Nguyễn Huệ, TP. HCM"
          />

          <TextareaField
            of={form}
            path={["note"]}
            label="Ghi chú"
            placeholder="Giao hàng thứ 3-5-7"
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
              {isPending ? "Đang tạo..." : "Thêm nhà cung cấp"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
