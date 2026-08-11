"use client";

import { Form, reset } from "@formisch/react";
import { Delete02Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { InputField } from "@/components/form/InputField";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { ValidationError } from "@/errors";
import {
  CONVERSION_TYPE_LABELS,
  type DetailedUnit,
  type Unit,
  useGetUnit,
  useUpdateUnit,
} from "@/features/unit";
import {
  type UnitConversion,
  useDeleteConversion,
} from "@/features/unit-conversion";
import { CreateConversionDialog } from "./create-conversion-dialog";
import { EditConversionDialog } from "./edit-conversion-dialog";

interface EditUnitDialogProps {
  unit: Unit | null;
  onClose: () => void;
}

export function EditUnitDialog({ unit, onClose }: EditUnitDialogProps) {
  const [open, setOpen] = useState(false);

  const { data: detailedUnit, status: detailedUnitStatus } = useGetUnit(
    unit?.id ?? 0,
    { enabled: !!unit },
  );

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
      <DialogContent className="sm:max-w-lg">
        {unit && detailedUnitStatus === "pending" ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-6" />
          </div>
        ) : detailedUnit ? (
          <EditUnitFormContent
            unit={detailedUnit}
            onClose={() => setOpen(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

interface EditUnitFormContentProps {
  unit: DetailedUnit;
  onClose: () => void;
}

function EditUnitFormContent({ unit, onClose }: EditUnitFormContentProps) {
  const formId = `edit-unit-form-${unit.id}`;

  const { form, handleSubmit, isPending, isDirty, error } = useUpdateUnit(
    unit.id,
    {
      code: unit.code,
      name: unit.name,
      conversionType: unit.conversionType,
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
            conversionType: data.conversionType,
          },
        });
      },
    },
  );

  const [editingConversion, setEditingConversion] =
    useState<UnitConversion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UnitConversion | null>(null);

  const { mutate: deleteConversion, isPending: isDeleting } =
    useDeleteConversion();

  const conversionColumns = useMemo<ColumnDef<UnitConversion>[]>(
    () => [
      {
        id: "formula",
        header: "Quy đổi",
        cell: ({ row }) => {
          const rowValue = row.original;

          return (
            <span className="inline-flex items-baseline gap-1">
              <code>1</code> {rowValue.fromUnit.name}
              {rowValue.material ? (
                <strong>"{rowValue.material.name}"</strong>
              ) : undefined}{" "}
              =<code>{Number.parseFloat(rowValue.factor)}</code>
              {rowValue.toUnit.name}
            </span>
          );
        },
        minSize: 150,
      },
      {
        id: "actions",
        header: "",
        minSize: 40,
        cell: ({ row }) => (
          <div className="flex justify-end gap-0.5">
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => setEditingConversion(row.original)}
            >
              <HugeiconsIcon
                icon={PencilEdit01Icon}
                strokeWidth={2}
                className="size-4"
              />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => setDeleteTarget(row.original)}
            >
              <HugeiconsIcon
                icon={Delete02Icon}
                strokeWidth={2}
                className="size-4 text-destructive"
              />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const conversionTable = useReactTable({
    data: unit.conversions,
    columns: conversionColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sửa đơn vị tính</DialogTitle>
        <DialogDescription>
          Chỉnh sửa thông tin đơn vị &quot;{unit.name}&quot;
        </DialogDescription>
      </DialogHeader>

      <Form id={formId} of={form} onSubmit={handleSubmit} className="contents">
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

        <Field>
          <FieldTitle>Loại quy đổi</FieldTitle>
          <Input
            className="bg-secondary"
            readOnly
            value={
              CONVERSION_TYPE_LABELS[unit.conversionType] ?? unit.conversionType
            }
          />
          <FieldDescription>
            {unit.conversionType === "global"
              ? "Quy đổi cố định, áp dụng cho mọi vật tư (VD: 1 tấn = 1000 kg). Loại quy đổi không thể thay đổi sau khi tạo."
              : "Quy đổi phụ thuộc vào loại vật tư cụ thể (VD: 1 bao xi măng = 50 kg, 1 bao ốc vít = 500 g). Loại quy đổi không thể thay đổi sau khi tạo."}
          </FieldDescription>
        </Field>
      </Form>

      <div className="pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Quy đổi</h3>

          <CreateConversionDialog unit={unit} />
        </div>

        <div className="rounded-md border max-h-48 overflow-y-auto">
          <DataTable
            table={conversionTable}
            showHeader={false}
            emptyPlaceholder="Đơn vị này chưa có quy đổi nào"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onClose}>
          Hủy
        </Button>
        <Button form={formId} type="submit" disabled={!isDirty || isPending}>
          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </DialogFooter>

      <EditConversionDialog
        conversion={editingConversion}
        onClose={() => setEditingConversion(null)}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Xoá quy đổi"
        description={
          deleteTarget ? (
            <>
              Bạn có chắc muốn xoá quy đổi{" "}
              <strong>
                &quot;1 {unit.code} = {Number.parseFloat(deleteTarget.factor)}{" "}
                {deleteTarget.toUnit.code}&quot;
              </strong>
              ? Hành động này không thể hoàn tác.
            </>
          ) : (
            ""
          )
        }
        onConfirm={() => {
          if (deleteTarget) deleteConversion(deleteTarget.id);
        }}
        isPending={isDeleting}
      />
    </>
  );
}
