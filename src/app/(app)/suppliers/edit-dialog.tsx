"use client";

import { Form } from "@formisch/react";
import { useEffect, useState } from "react";
import { InputField } from "@/components/form/InputField";
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
import { ValidationError } from "@/errors";
import { type Supplier, useUpdateSupplier } from "@/features/supplier";

interface EditSupplierDialogProps {
  supplier: Supplier | null;
  onClose: () => void;
}

export function EditSupplierDialog({
  supplier,
  onClose,
}: EditSupplierDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (supplier) setOpen(true);
  }, [supplier]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        {supplier && (
          <EditSupplierForm
            supplier={supplier}
            onClose={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface EditSupplierFormProps {
  supplier: Supplier;
  onClose: () => void;
}

function EditSupplierForm({ supplier, onClose }: EditSupplierFormProps) {
  const { form, handleSubmit, isPending, isDirty, error } = useUpdateSupplier(
    supplier.id,
    {
      code: supplier.code,
      name: supplier.name,
      taxCode: supplier.taxCode,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      note: supplier.note,
    },
    {
      onSuccess: () => {
        toast.add({
          title: "Thành công",
          description: "Nhà cung cấp đã được cập nhật",
        });
        onClose();
      },
    },
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sửa nhà cung cấp</DialogTitle>
        <DialogDescription>
          Chỉnh sửa thông tin nhà cung cấp &quot;{supplier.name}&quot;
        </DialogDescription>
      </DialogHeader>

      <Form of={form} onSubmit={handleSubmit} className="space-y-4">
        {error && !(error instanceof ValidationError) && (
          <Alert>Lỗi: {error.message}</Alert>
        )}

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
