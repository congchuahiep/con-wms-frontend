"use client";

import { Building02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { ValidationError } from "@/errors";
import {
  type SettleLineInput,
  type Site,
  type SiteRequirementRow,
  useSettleSite,
} from "@/features/site";
import { useGetWarehouses } from "@/features/warehouse";
import { formatDecimal, normalizeDecimal } from "@/utils/format";

interface SettleDialogProps {
  site: Site;
  /** Bảng so sánh định mức vs tồn kho — nguồn tính mặc định trả về. */
  rows: SiteRequirementRow[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type LineState = {
  materialId: number;
  quantity: string;
  note: string;
};

export function SettleDialog({
  site,
  rows,
  open,
  onOpenChange,
}: SettleDialogProps) {
  const { data: warehouses = [] } = useGetWarehouses({ includeSite: true });
  const { mutateAsync, isPending, error } = useSettleSite(site.id);

  /** Kho đích: kho đang hoạt động, khác kho công trường của site này. */
  const targetOptions = useMemo(
    () =>
      warehouses
        .filter(
          (w) =>
            w.isActive && w.id !== site.warehouse?.id && w.site?.id !== site.id,
        )
        .slice()
        .sort((a, b) => {
          if (a.site && !b.site) return 1;
          if (!a.site && b.site) return -1;
          return a.code.localeCompare(b.code);
        })
        .map((w) => ({
          value: String(w.id),
          label: `${w.code} - ${w.name}${w.site ? ` (${w.site.code})` : ""}`,
        }))
        .filter(
          (option, index, arr) =>
            arr.findIndex((o) => o.value === option.value) === index,
        ),
    [warehouses, site.id, site.warehouse?.id],
  );

  const [toWarehouseId, setToWarehouseId] = useState<string>("");
  const [lines, setLines] = useState<LineState[]>([]);

  // Danh sách vật tư thiếu định mức — chặn tất toán
  const missing = useMemo(
    () =>
      rows
        .filter((row) => row.status === "insufficient")
        .map(
          (row) =>
            `${row.material.code} (tồn ${formatDecimal(row.balance)}/${formatDecimal(row.requiredQuantity)})`,
        ),
    [rows],
  );

  // Khi mở dialog: chọn kho trung tâm đầu tiên + dựng dòng mặc định
  // biome-ignore lint/correctness/useExhaustiveDependencies: Chỉ dựng khi dialog mở
  useEffect(() => {
    if (!open) return;
    const defaultTarget = targetOptions.find((o) => !o.label.includes("("));
    setToWarehouseId(defaultTarget?.value ?? targetOptions[0]?.value ?? "");
    setLines(
      rows
        .filter((row) => Number(row.defaultReturnQuantity) > 0)
        .map((row) => ({
          materialId: row.material.id,
          quantity: normalizeDecimal(row.defaultReturnQuantity),
          note: "",
        })),
    );
  }, [open]);

  const materialById = useMemo(() => {
    const map = new Map<number, SiteRequirementRow>();
    for (const row of rows) map.set(row.material.id, row);
    return map;
  }, [rows]);

  const canSettle =
    missing.length === 0 && lines.some((l) => Number(l.quantity) > 0);

  const handleSubmit = async () => {
    const linesPayload: SettleLineInput[] = lines
      .filter((l) => Number(l.quantity) > 0)
      .map((l) => ({
        materialId: l.materialId,
        quantity: l.quantity,
        note: l.note,
      }));

    if (!toWarehouseId) {
      toast.add({
        type: "error",
        title: "Chưa chọn kho đích",
        description: "Vui lòng chọn kho nhận vật tư trả về.",
      });
      return;
    }
    if (linesPayload.length === 0) {
      toast.add({
        type: "error",
        title: "Chưa có dòng trả về",
        description: "Nhập số lượng ít nhất 1 dòng.",
      });
      return;
    }
    for (const line of linesPayload) {
      const row = materialById.get(line.materialId);
      if (row && Number(line.quantity) > Number(row.balance)) {
        toast.add({
          type: "error",
          title: "Số lượng vượt tồn kho",
          description: `${row.material.code}: tồn ${formatDecimal(row.balance)}, chỉ trả tối đa bằng tồn.`,
        });
        return;
      }
      if (
        row &&
        Number(line.quantity) < Number(row.defaultReturnQuantity) &&
        !line.note?.trim()
      ) {
        toast.add({
          type: "error",
          title: "Cần ghi lý do",
          description: `${row.material.code}: trả ít hơn mặc định (${formatDecimal(row.defaultReturnQuantity)}) phải ghi lý do.`,
        });
        return;
      }
    }

    try {
      const result = await mutateAsync({
        toWarehouseId: Number(toWarehouseId),
        lines: linesPayload,
      });
      toast.add({
        title: "Đã tất toán",
        description: `Công trường ${site.code} hoàn thành — phiếu ${result.outboundNote.number}`,
      });
      onOpenChange(false);
    } catch {
      // Lỗi hiển thị trong Alert bên dưới
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-2xl">
        <DialogHeader>
          <DialogTitle>Tất toán công trường {site.name}</DialogTitle>
          <DialogDescription>
            Đưa vật tư thừa/ngoài định mức về kho khác còn hoạt động. Phần đúng
            định mức được coi là đã dùng cho công trường và ở lại.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {missing.length > 0 && (
            <Alert>
              <div>
                Công trường còn thiếu định mức, không tất toán được:
                <div className="mt-1 text-xs">{missing.join(" · ")}</div>
              </div>
            </Alert>
          )}

          {error && (
            <Alert>
              {error instanceof ValidationError
                ? Object.values(error.fields).flat().join(" · ")
                : error.message}
            </Alert>
          )}

          <div className="space-y-1.5">
            <span className="block text-sm font-medium">
              Kho nhận vật tư trả về *
            </span>
            <Select
              value={toWarehouseId}
              onValueChange={(next) => next && setToWarehouseId(next)}
            >
              <SelectTrigger>
                <HugeiconsIcon
                  icon={Building02Icon}
                  strokeWidth={2}
                  className="text-muted-foreground"
                />
                <SelectValue placeholder="Chọn kho đích">
                  {(value: string) =>
                    targetOptions.find((o) => o.value === value)?.label ?? value
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {targetOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {lines.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_110px_1fr] items-center text-xs text-muted-foreground *:pl-1">
                <span>Vật tư trả về</span>
                <span>Số lượng</span>
                <span>Lý do (nếu trả ít hơn mặc định)</span>
              </div>
              {lines.map((line, index) => {
                const row = materialById.get(line.materialId);
                const belowDefault =
                  row !== undefined &&
                  Number(line.quantity) > 0 &&
                  Number(line.quantity) < Number(row.defaultReturnQuantity);
                return (
                  <div key={line.materialId} className="space-y-1">
                    <div className="grid grid-cols-[1fr_110px_1fr] items-center gap-2">
                      <div className="min-w-0 truncate text-sm">
                        <span className="font-medium">
                          {row?.material.name}
                        </span>{" "}
                        <span className="text-xs text-muted-foreground">
                          ({row?.material.code} · {row?.material.unit})
                        </span>
                      </div>
                      <Input
                        value={line.quantity}
                        onChange={(e) =>
                          setLines((prev) =>
                            prev.map((l, i) =>
                              i === index
                                ? { ...l, quantity: e.target.value }
                                : l,
                            ),
                          )
                        }
                        inputMode="decimal"
                      />
                      <Input
                        value={line.note}
                        onChange={(e) =>
                          setLines((prev) =>
                            prev.map((l, i) =>
                              i === index ? { ...l, note: e.target.value } : l,
                            ),
                          )
                        }
                        placeholder="Lý do giảm số lượng..."
                      />
                    </div>
                    {belowDefault && row !== undefined && (
                      <p className="pl-1 text-xs text-amber-600">
                        Trả ít hơn mặc định (
                        {formatDecimal(row.defaultReturnQuantity)}) — bắt buộc
                        ghi lý do.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              Vật tư trong định mức (đã dùng):
            </span>
            <Badge variant="secondary">
              {rows.filter((r) => r.status === "sufficient").length} loại đủ
            </Badge>
          </div>
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
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!canSettle || isPending}
          >
            {isPending ? "Đang tất toán..." : "Tất toán"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
