"use client";

import { Form } from "@formisch/react";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CONVERSION_TYPE_LABELS, useAddUnit } from "@/features/unit";

const CONVERSION_TYPE_OPTIONS = [
  {
    value: "global",
    label: CONVERSION_TYPE_LABELS.global,
    description: (
      <>
        Quy đổi cố định, áp dụng cho mọi vật tư <i>(VD: 1 tấn = 1000 kg)</i>
      </>
    ),
  },
  {
    value: "material",
    label: CONVERSION_TYPE_LABELS.material,
    description: (
      <>
        Quy đổi phụ thuộc vào loại vật tư{" "}
        <i>(VD: 1 bao xi măng = 50 kg, 1 bao ốc vít = 500 g)</i>
      </>
    ),
  },
];

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

          <SelectField
            of={form}
            path={["conversionType"]}
            label="Loại quy đổi"
            description="Quyết định cách quy đổi của đơn vị này. Không thể thay đổi sau khi tạo."
            options={CONVERSION_TYPE_OPTIONS}
            renderOption={(opt) => {
              const option = opt as (typeof CONVERSION_TYPE_OPTIONS)[number];

              return (
                <div className="flex flex-col">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-muted-foreground text-xs">
                    {option.description}
                  </div>
                </div>
              );
            }}
            renderValue={(opt) =>
              CONVERSION_TYPE_LABELS[opt.value] ?? opt.label
            }
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
