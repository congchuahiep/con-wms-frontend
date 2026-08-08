"use client";

import { Form, reset } from "@formisch/react";
import { useEffect, useMemo, useState } from "react";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
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
import {
  type MaterialCategory,
  type MaterialCategoryColor,
  useGetCategories,
  useUpdateCategory,
} from "@/features/material-category";
import { cn } from "@/lib/utils";

interface EditCategoryDialogProps {
  category: MaterialCategory | null;
  onClose: () => void;
}

export function EditCategoryDialog({
  category,
  onClose,
}: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (category) setOpen(true);
  }, [category]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        {category && (
          <EditCategoryFormContent
            category={category}
            onClose={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Flatten tree → select options */
function flattenForSelect(
  nodes: MaterialCategory[],
  depth = 0,
): Array<{ value: string; label: string }> {
  return nodes.flatMap((node) => [
    {
      value: String(node.id),
      label: `${"\u00A0\u00A0\u00A0".repeat(depth)}${node.name}`,
    },
    ...flattenForSelect(node.children, depth + 1),
  ]);
}

const COLOR_OPTIONS: Array<{ value: MaterialCategoryColor; label: string }> = [
  { value: "red", label: "Đỏ" },
  { value: "orange", label: "Cam" },
  { value: "yellow", label: "Vàng" },
  { value: "green", label: "Xanh lá" },
  { value: "teal", label: "Xanh ngọc" },
  { value: "blue", label: "Xanh dương" },
  { value: "indigo", label: "Chàm" },
  { value: "purple", label: "Tím" },
  { value: "pink", label: "Hồng" },
  { value: "gray", label: "Xám" },
];

const COLOR_DOT_MAP: Record<MaterialCategoryColor, string> = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  teal: "bg-teal-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  gray: "bg-gray-500",
};

interface EditCategoryFormContentProps {
  category: MaterialCategory;
  onClose: () => void;
}

function EditCategoryFormContent({
  category,
  onClose,
}: EditCategoryFormContentProps) {
  const { data: categories = [] } = useGetCategories();

  const parentOptions = useMemo(
    () => flattenForSelect(categories.filter((c) => c.id !== category.id)),
    [categories, category.id],
  );

  const { form, handleSubmit, isPending, isDirty, error } = useUpdateCategory(
    category.id,
    {
      code: category.code,
      name: category.name,
      description: category.description,
      color: category.color,
      parentId: category.parentId,
    },
    {
      onSuccess: (data) => {
        toast.add({
          title: "Thành công",
          description: "Danh mục đã được cập nhật",
        });
        reset(form, {
          initialInput: {
            code: data.code,
            name: data.name,
            description: data.description,
            color: data.color,
            parentId: data.parentId,
          },
        });
      },
    },
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sửa danh mục vật tư</DialogTitle>
        <DialogDescription>
          Chỉnh sửa thông tin danh mục &quot;{category.name}&quot;
        </DialogDescription>
      </DialogHeader>

      <Form of={form} onSubmit={handleSubmit} className="space-y-4">
        {error && !(error instanceof ValidationError) && (
          <Alert>Lỗi: {error.message}</Alert>
        )}

        <InputField
          of={form}
          path={["code"]}
          label="Mã danh mục"
          placeholder="VD: VLXD"
          required
        />

        <InputField
          of={form}
          path={["name"]}
          label="Tên danh mục"
          placeholder="Vật liệu xây dựng"
          required
        />

        <TextareaField
          of={form}
          path={["description"]}
          label="Mô tả"
          placeholder="Nhóm vật liệu thô dùng trong xây dựng"
        />

        <SelectField
          of={form}
          path={["parentId"]}
          label="Danh mục cha"
          options={parentOptions}
          transform={(v) => (v === "" ? null : Number(v))}
          renderValue={(opt) => opt.label.replace(/^[\u00A0]+/, "")}
        />

        <SelectField
          of={form}
          path={["color"]}
          label="Màu sắc"
          options={COLOR_OPTIONS.map((c) => ({
            value: c.value,
            label: c.label,
          }))}
          transform={(v) => (v === "" ? null : v)}
          renderOption={(opt) => {
            const color = opt.value as MaterialCategoryColor;
            return (
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-block size-3 rounded-full shrink-0",
                    COLOR_DOT_MAP[color] ?? "bg-muted",
                  )}
                />
                {opt.label}
              </span>
            );
          }}
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
