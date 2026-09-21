"use client";

import { Form, getInput, insert, remove, useFieldArray } from "@formisch/react";
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect } from "react";
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
import { MaterialComboboxField } from "@/features/material";
import {
  type SiteRequirementRow,
  useUpdateSiteRequirements,
} from "@/features/site";
import { toRequirementsInput } from "@/features/site/utils";

interface RequirementsDialogProps {
  siteId: number;
  /** Bảng so sánh hiện tại — dùng để dựng các dòng định mức ban đầu. */
  rows: SiteRequirementRow[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY_LINE = { materialId: null, quantity: "", note: "" };

export function RequirementsDialog({
  siteId,
  rows,
  open,
  onOpenChange,
}: RequirementsDialogProps) {
  const { form, handleSubmit, isPending, error, resetForm } =
    useUpdateSiteRequirements(siteId, {
      onSuccess: () => {
        toast.add({
          title: "Thành công",
          description: "Đã lưu định mức vật tư",
        });
        onOpenChange(false);
      },
    });

  // Khi mở dialog: dựng form từ định mức hiện tại
  // biome-ignore lint/correctness/useExhaustiveDependencies: Chỉ dựng form khi dialog mở
  useEffect(() => {
    if (!open) return;
    resetForm();
    for (const line of toRequirementsInput(rows).lines) {
      insert(form, { path: ["lines"], initialInput: line });
    }
  }, [open]);

  const lines =
    (getInput(form, { path: ["lines"] }) as unknown as
      | LineItem[]
      | undefined) ?? [];

  const linesFieldArray = useFieldArray(form, { path: ["lines"] });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-2xl">
        <DialogHeader>
          <DialogTitle>Sửa định mức vật tư</DialogTitle>
          <DialogDescription>
            Khai báo công trường cần những vật tư gì, số lượng bao nhiêu — dùng
            làm mốc so sánh với tồn kho công trường (không giới hạn việc nhập
            thêm vật tư ngoài định mức).
          </DialogDescription>
        </DialogHeader>

        <Form of={form} onSubmit={handleSubmit} className="space-y-4">
          {error && !(error instanceof ValidationError) && (
            <Alert>Lỗi: {error.message}</Alert>
          )}

          <div className="space-y-2">
            {lines.length > 0 && (
              <div className="grid grid-cols-[1fr_110px_1fr_32px] items-center text-xs text-muted-foreground text-start *:pl-1">
                <span>Vật tư *</span>
                <span>Số lượng *</span>
                <span>Ghi chú</span>
                <span />
              </div>
            )}
            {lines.map((_line, index) => (
              <div
                key={linesFieldArray.items[index] ?? index}
                className="grid grid-cols-[1fr_110px_1fr_32px] w-full items-center"
              >
                <MaterialComboboxField
                  of={form}
                  path={["lines", index, "materialId"]}
                  placeholder="Chọn vật tư"
                  inputClassName="border-r-0 rounded-r-none"
                  required
                  noField
                />
                <InputField
                  of={form}
                  path={["lines", index, "quantity"]}
                  placeholder="0"
                  inputClassName="border-r-0 rounded-none"
                  noField
                />
                <InputField
                  of={form}
                  path={["lines", index, "note"]}
                  placeholder="Ghi chú"
                  inputClassName="border-r-0 rounded-none"
                  noField
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="border-l-0 rounded-l-none"
                  aria-label="Xóa dòng"
                  disabled={isPending}
                  onClick={() => remove(form, { path: ["lines"], at: index })}
                >
                  <HugeiconsIcon
                    icon={Delete02Icon}
                    strokeWidth={2}
                    className="size-4 text-destructive"
                  />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() =>
                insert(form, {
                  path: ["lines"],
                  initialInput: { ...EMPTY_LINE },
                })
              }
            >
              <HugeiconsIcon
                icon={Add01Icon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              Thêm dòng
            </Button>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu định mức"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type LineItem = { materialId: number | null; quantity: string; note?: string };
