"use client";

import { Form } from "@formisch/react";
import { useMemo } from "react";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
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
import {
  type MaterialCategory,
  type MaterialCategoryColor,
  useAddCategory,
  useGetCategories,
} from "@/features/material-category";
import { cn } from "@/lib/utils";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Flatten tree → select options với label có indent theo depth */
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

/** Danh sách 10 màu cho color select */
const COLOR_OPTIONS: Array<{
  value: MaterialCategoryColor;
  label: string;
}> = [
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

/** Map color value → Tailwind class cho dot */
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

export function CreateCategoryDialog({
  open,
  onOpenChange,
}: CreateCategoryDialogProps) {
  const { data: categories = [] } = useGetCategories();

  const parentOptions = useMemo(
    () => flattenForSelect(categories),
    [categories],
  );

  const { form, handleSubmit, isPending, resetForm } = useAddCategory({
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
          <DialogTitle>Thêm danh mục vật tư</DialogTitle>
          <DialogDescription>
            Tạo danh mục mới để phân loại vật tư
          </DialogDescription>
        </DialogHeader>

        <Form of={form} onSubmit={handleSubmit} className="space-y-4">
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
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang tạo..." : "Thêm danh mục vật tư"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
