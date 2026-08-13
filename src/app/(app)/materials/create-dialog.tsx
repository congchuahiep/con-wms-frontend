"use client";

import { Field as FormField, Form } from "@formisch/react";
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
import { useAddMaterial } from "@/features/material";
import { CategorySelectField } from "@/features/material-category";
import { UnitSelectField, useGetUnits } from "@/features/unit";
import { MaterialConversionSection } from "./conversion-section";

interface CreateMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMaterialDialog({
  open,
  onOpenChange,
}: CreateMaterialDialogProps) {
  const { form, handleSubmit, isPending, resetForm } = useAddMaterial({
    onSuccess: () => onOpenChange(false),
  });
  const { data: units = [] } = useGetUnits();

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
          <DialogTitle>Thêm vật tư</DialogTitle>
          <DialogDescription>Tạo vật tư mới trong danh mục</DialogDescription>
        </DialogHeader>

        <Form of={form} onSubmit={handleSubmit} className="space-y-4">
          <InputField
            of={form}
            path={["code"]}
            label="Mã vật tư"
            placeholder="VD: XM-HT-PCB40"
            required
          />

          <InputField
            of={form}
            path={["name"]}
            label="Tên vật tư"
            placeholder="Xi măng Hà Tiên PCB40"
            required
          />

          <CategorySelectField
            of={form}
            path={["categoryId"]}
            label="Danh mục"
            required
          />

          <UnitSelectField
            of={form}
            path={["unitId"]}
            label="Đơn vị tính"
            required
          />

          <FormField of={form} path={["unitId"]}>
            {(field) => {
              const selectedUnit = units.find(
                (u) => u.id === Number(field.input),
              );

              return selectedUnit?.conversionType === "material" ? (
                <MaterialConversionSection
                  form={form}
                  unit={selectedUnit}
                  disabled={isPending}
                />
              ) : (
                <></>
              );
            }}
          </FormField>

          <TextareaField
            of={form}
            path={["description"]}
            label="Mô tả"
            placeholder="PCB40, 50kg/bao"
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
              {isPending ? "Đang tạo..." : "Thêm vật tư"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
