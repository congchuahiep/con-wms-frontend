"use client";

import {
  Field as FormField,
  type FormStore,
  Form,
  getInput,
  reset,
} from "@formisch/react";
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
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { ValidationError } from "@/errors";
import {
  type MaterialSchema,
  type Material,
  type MaterialDetail,
  useGetMaterial,
  useUpdateMaterial,
} from "@/features/material";
import { CategorySelectField } from "@/features/material-category";
import { UnitSelectField, useGetUnits } from "@/features/unit";
import { MaterialConversionSection } from "./conversion-section";

interface EditMaterialDialogProps {
  material: Material | null;
  onClose: () => void;
}

export function EditMaterialDialog({
  material,
  onClose,
}: EditMaterialDialogProps) {
  const [open, setOpen] = useState(false);

  const { data: detail, status } = useGetMaterial(material?.id ?? 0, {
    enabled: !!material,
  });

  useEffect(() => {
    if (material) setOpen(true);
  }, [material]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        {material && status === "pending" ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-6" />
          </div>
        ) : detail ? (
          <EditMaterialFormContent
            material={detail}
            onClose={() => setOpen(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

interface EditMaterialFormContentProps {
  material: MaterialDetail;
  onClose: () => void;
}

function EditMaterialFormContent({
  material,
  onClose,
}: EditMaterialFormContentProps) {
  const { form, handleSubmit, isPending, isDirty, error } = useUpdateMaterial(
    material.id,
    {
      code: material.code,
      name: material.name,
      categoryId: material.category.id,
      unitId: material.unit.id,
      description: material.description,
      conversions: material.conversions.map((conversion) => ({
        toUnitId: conversion.toUnit.id,
        factor: conversion.factor,
      })),
    },
    {
      onSuccess: (data) => {
        toast.add({
          title: "Thành công",
          description: "Vật tư đã được cập nhật",
        });
        reset(form, {
          initialInput: {
            code: data.code,
            name: data.name,
            categoryId: data.category.id,
            unitId: data.unit.id,
            description: data.description,
            conversions: getInput(form, { path: ["conversions"] }),
          },
        });
      },
    },
  );

  const { data: units = [] } = useGetUnits();

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sửa vật tư</DialogTitle>
        <DialogDescription>
          Chỉnh sửa thông tin vật tư &quot;{material.name}&quot;
        </DialogDescription>
      </DialogHeader>

      <Form of={form} onSubmit={handleSubmit} className="space-y-4">
        {error && !(error instanceof ValidationError) && (
          <Alert>Lỗi: {error.message}</Alert>
        )}

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
                form={form as unknown as FormStore<typeof MaterialSchema>}
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
