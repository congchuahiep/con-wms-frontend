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
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authApi } from "@/configs/api";
import { materialKeys } from "@/configs/querykeys";
import type {
  InboundNoteSchema,
  InboundNoteType,
} from "@/features/inbound-note";
import {
  type Material,
  MaterialSelectField,
  type SimpleMaterial,
} from "@/features/material";
import { SupplierSelectField } from "@/features/supplier";
import { WarehouseSelectField } from "@/features/warehouse";
import type { Paginated } from "@/types";
import { formatDecimal } from "@/utils/format";

interface NoteFormProps {
  form: FormStore<typeof InboundNoteSchema>;
  onSubmit: SubmitEventHandler<typeof InboundNoteSchema>;
  isPending: boolean;
  submitLabel: string;
  onCancel: () => void;
  /** Seed cache combobox vật tư (edit mode: materials của các dòng đã chọn). */
  initialMaterials?: SimpleMaterial[];
}

type LineItem = {
  materialId: number | null;
  quantity: string;
  unitPrice: string;
  note?: string;
};

const EMPTY_LINE: LineItem = {
  materialId: null,
  quantity: "",
  unitPrice: "",
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

  // Item IDs ổn định của field array — dùng làm React key cho từng dòng
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
        description: `${matched.code} — nhập thêm số lượng`,
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
      <FormField of={form} path={["supplierId"]}>
        {(supplierField) => (
          <FormField of={form} path={["noteType"]}>
            {(noteTypeField) => {
              const noteType = noteTypeField.input as InboundNoteType;
              return (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-medium">
                      Loại phiếu
                    </span>
                    <ButtonGroup>
                      <Button
                        size="sm"
                        variant={
                          noteType === "purchase" ? "default" : "outline"
                        }
                        type="button"
                        onClick={() =>
                          noteTypeField.onChange("purchase" as never)
                        }
                      >
                        Nhập mua
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          noteType === "return_from_site"
                            ? "default"
                            : "outline"
                        }
                        type="button"
                        onClick={() => {
                          noteTypeField.onChange("return_from_site" as never);
                          supplierField.onChange(null as never);
                        }}
                      >
                        Nhập hàng công trường trả lại
                      </Button>
                    </ButtonGroup>
                  </div>

                  <InputField
                    of={form}
                    path={["date"]}
                    label="Ngày nhập"
                    type="date"
                    required
                  />

                  <WarehouseSelectField
                    of={form}
                    path={["warehouseId"]}
                    label="Kho nhận hàng"
                    required
                  />

                  {noteType === "purchase" && (
                    <SupplierSelectField
                      of={form}
                      path={["supplierId"]}
                      label="Nhà cung cấp"
                      required
                    />
                  )}

                  <div className="sm:col-span-2">
                    <TextareaField
                      of={form}
                      path={["note"]}
                      label="Ghi chú"
                      placeholder="VD: Nhập xi măng + cát cho công trình cầu Rạch Giá"
                    />
                  </div>
                </div>
              );
            }}
          </FormField>
        )}
      </FormField>

      <div className="space-y-2">
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

        <FormField of={form} path={["lines"]}>
          {(linesField) => {
            const lines = (linesField.input ?? []) as LineItem[];
            const totalQuantity = lines.reduce(
              (sum, line) => sum + (line.quantity ? Number(line.quantity) : 0),
              0,
            );
            const totalAmount = lines.reduce(
              (sum, line) =>
                sum +
                (line.quantity && line.unitPrice
                  ? Number(line.quantity) * Number(line.unitPrice)
                  : 0),
              0,
            );

            return (
              <Card>
                <CardContent>
                  {lines.length > 0 && (
                    <div className="grid grid-cols-[1fr_90px_120px_32px] items-center text-xs text-muted-foreground text-start *:pl-1">
                      <span>Vật tư *</span>
                      <span>Số lượng *</span>
                      <span>Đơn giá (đ) *</span>
                      <span />
                    </div>
                  )}
                  {lines.map((_line, index) => (
                    <ButtonGroup
                      key={linesFieldArray.items[index] ?? index}
                      className="grid grid-cols-[1fr_90px_120px_32px] w-full"
                    >
                      <MaterialSelectField
                        of={form}
                        path={["lines", index, "materialId"]}
                        placeholder="Chọn vật tư"
                        required
                        initialItems={initialMaterials}
                        noField
                      />
                      <InputField
                        of={form}
                        path={["lines", index, "quantity"]}
                        placeholder="0"
                        autoFocus={index === focusLineIndex}
                        noField
                      />
                      <InputField
                        of={form}
                        path={["lines", index, "unitPrice"]}
                        placeholder="0"
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
                      Tổng SL:{" "}
                      <span className="font-medium tabular-nums text-foreground">
                        {formatDecimal(totalQuantity)}
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      Tổng tiền:{" "}
                      <span className="font-medium tabular-nums text-foreground">
                        {formatDecimal(totalAmount, 2)} đ
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
