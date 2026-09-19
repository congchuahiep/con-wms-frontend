"use client";

import {
  Form,
  Field as FormField,
  type FormStore,
  getInput,
  insert,
  remove,
  type SubmitEventHandler,
  useFieldArray,
} from "@formisch/react";
import { Delete02Icon, ScanIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { InputField } from "@/components/form/InputField";
import { TextareaField } from "@/components/form/TextareaField";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authApi } from "@/configs/api";
import { materialKeys } from "@/configs/querykeys";
import type { Material, SimpleMaterial } from "@/features/material";
import { MaterialComboboxField } from "@/features/material";
import { WarehouseSelectField } from "@/features/warehouse";
import type { Paginated } from "@/types";
import { formatDecimal } from "@/utils/format";
import type { StocktakeNoteSchema } from "@/features/stocktake";

interface NoteFormProps {
  form: FormStore<typeof StocktakeNoteSchema>;
  onSubmit: SubmitEventHandler<typeof StocktakeNoteSchema>;
  isPending: boolean;
  submitLabel: string;
  onCancel: () => void;
  initialMaterials?: SimpleMaterial[];
}

type LineItem = {
  materialId: number | null;
  difference: string;
  reason: string;
  note?: string;
};

const EMPTY_LINE: LineItem = {
  materialId: null,
  difference: "",
  reason: "",
  note: "",
};

export function NoteForm({
  form,
  onSubmit,
  isPending,
  submitLabel,
  onCancel,
  initialMaterials,
}: NoteFormProps) {
  const queryClient = useQueryClient();
  const [scanValue, setScanValue] = useState("");
  const [focusLineIndex, setFocusLineIndex] = useState<number | null>(null);

  const linesFieldArray = useFieldArray(form, { path: ["lines"] });

  const handleScan = async (raw: string) => {
    const code = raw.trim();
    if (!code) return;

    const result = await queryClient.fetchQuery<Paginated<Material>>({
      queryKey: materialKeys.filteredList({ search: code, pageSize: 20 }),
      queryFn: async () => {
        const response = await authApi.get<Paginated<Material>>(
          (ep) => ep.materials.list,
          { params: { search: code, pageSize: 20 } },
        );
        return response.data;
      },
    });

    const matched = result.items.find(
      (material) => material.code.toLowerCase() === code.toLowerCase(),
    );

    if (!matched) {
      toast.add({
        type: "error",
        title: "Không tìm thấy vật tư",
        description: `Không có vật tư nào có mã "${code}"`,
      });
      return;
    }

    const lines = getInput(form, { path: ["lines"] }) as unknown as
      | LineItem[]
      | undefined;
    const existingIndex = (lines ?? []).findIndex(
      (line) => line.materialId === matched.id,
    );

    if (existingIndex >= 0) {
      setFocusLineIndex(existingIndex);
      toast.add({
        type: "info",
        title: "Vật tư đã có trong phiếu",
        description: `${matched.code} — chỉnh chênh lệch`,
      });
      return;
    }

    const newIndex = (lines ?? []).length;
    insert(form, {
      path: ["lines"],
      initialInput: { ...EMPTY_LINE, materialId: matched.id },
    });
    setFocusLineIndex(newIndex);
    setScanValue("");
  };

  return (
    <Form of={form} onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InputField
          of={form}
          path={["date"]}
          label="Ngày kiểm kê"
          type="date"
          required
        />

        <WarehouseSelectField
          of={form}
          path={["warehouseId"]}
          label="Kho kiểm kê"
          required
        />

        <div className="sm:col-span-2">
          <TextareaField
            of={form}
            path={["note"]}
            label="Ghi chú"
            placeholder="VD: Kiểm kê định kỳ tháng 8"
          />
        </div>
      </div>

      <FormField of={form} path={["warehouseId"]}>
        {(warehouseField) =>
          warehouseField.input ? (
            <Alert>
              <span className="text-sm text-muted-foreground">
                Tồn hiện tại lấy động từ{" "}
                <code>/api/stock/?warehouse={String(warehouseField.input)}</code>{" "}
                — dùng để đối chiếu chênh lệch, không lưu vào phiếu.
              </span>
            </Alert>
          ) : (
            <span className="hidden" />
          )
        }
      </FormField>

      <div className="space-y-2">
        <FormField of={form} path={["lines"]}>
          {(linesField) => {
            const lines = (linesField.input ?? []) as LineItem[];
            const totalDifference = lines.reduce(
              (sum, line) =>
                sum + (line.difference ? Number(line.difference) : 0),
              0,
            );

            return (
              <Card>
                <CardContent className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <HugeiconsIcon
                        icon={ScanIcon}
                        strokeWidth={2}
                        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        placeholder="Quét mã / SKU (Enter để thêm dòng)"
                        value={scanValue}
                        onChange={(e) => setScanValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            void handleScan(scanValue);
                          }
                        }}
                        className="pl-9 font-mono"
                        disabled={isPending}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void handleScan(scanValue)}
                      disabled={isPending || !scanValue.trim()}
                    >
                      Thêm
                    </Button>
                  </div>

                  {lines.length > 0 && (
                    <div className="grid grid-cols-[1fr_90px_1fr_32px] items-center text-xs text-muted-foreground text-start *:pl-1">
                      <span>Vật tư *</span>
                      <span>Chênh lệch *</span>
                      <span>Lý do *</span>
                      <span />
                    </div>
                  )}
                  {lines.map((_line, index) => (
                    <ButtonGroup
                      key={linesFieldArray.items[index] ?? index}
                      className="grid grid-cols-[1fr_90px_1fr_32px] w-full"
                    >
                      <MaterialComboboxField
                        of={form}
                        path={["lines", index, "materialId"]}
                        placeholder="Chọn vật tư"
                        required
                        initialItems={initialMaterials}
                        noField
                      />
                      <InputField
                        of={form}
                        path={["lines", index, "difference"]}
                        placeholder="±0"
                        autoFocus={index === focusLineIndex}
                        noField
                      />
                      <InputField
                        of={form}
                        path={["lines", index, "reason"]}
                        placeholder="Lý do"
                        noField
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="Xóa dòng"
                        disabled={isPending}
                        onClick={() =>
                          remove(form, { path: ["lines"], at: index })
                        }
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          strokeWidth={2}
                          className="size-4 text-destructive"
                        />
                      </Button>
                    </ButtonGroup>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => {
                      const newIndex = lines.length;
                      insert(form, {
                        path: ["lines"],
                        initialInput: { ...EMPTY_LINE },
                      });
                      setFocusLineIndex(newIndex);
                    }}
                  >
                    + Thêm dòng
                  </Button>
                </CardContent>

                {lines.length > 0 && (
                  <CardFooter className="justify-end gap-3">
                    <span className="text-muted-foreground">
                      Tổng chênh lệch:{" "}
                      <span className="font-medium tabular-nums text-foreground">
                        {formatDecimal(totalDifference)}
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      Số dòng:{" "}
                      <span className="font-medium tabular-nums text-foreground">
                        {lines.length}
                      </span>
                    </span>
                  </CardFooter>
                )}
              </Card>
            );
          }}
        </FormField>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Đang xử lý..." : submitLabel}
        </Button>
      </DialogFooter>
    </Form>
  );
}
