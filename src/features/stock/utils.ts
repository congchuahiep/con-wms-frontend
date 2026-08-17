import type { InboundNoteType } from "../inbound-note";
import type { MovementType } from "./types";

/**
 * Màu badge cho từng loại dòng sổ kho (dùng ở tồn kho + sổ kho).
 */
export const MOVEMENT_TYPE_COLOR_MAP: Record<MovementType, string> = {
  inbound_purchase_from_supplier:
    "bg-green-100 text-green-700 border-green-300",
  inbound_return_from_site: "bg-teal-100 text-teal-700 border-teal-300",
  outbound_issue_for_use: "bg-red-100 text-red-700 border-red-300",
  outbound_transfer_to_warehouse:
    "bg-orange-100 text-orange-700 border-orange-300",
  inbound_transfer_from_warehouse: "bg-blue-100 text-blue-700 border-blue-300",
  stocktake_adjustment: "bg-purple-100 text-purple-700 border-purple-300",
};

/**
 * Label tiếng Việt cho filter/select (backend trả sẵn label ở response).
 */
export const MOVEMENT_TYPE_LABEL_MAP: Record<MovementType, string> = {
  inbound_purchase_from_supplier: "Nhập kho: mua hàng từ nhà cung cấp",
  inbound_return_from_site: "Nhập kho: công trường trả lại hàng",
  outbound_issue_for_use: "Xuất kho: cấp phát để sử dụng",
  outbound_transfer_to_warehouse: "Xuất kho: điều chuyển sang kho khác",
  inbound_transfer_from_warehouse: "Nhập kho: điều chuyển từ kho khác",
  stocktake_adjustment: "Điều chỉnh tồn: chênh lệch kiểm kê",
};

export const MOVEMENT_TYPES = Object.keys(
  MOVEMENT_TYPE_LABEL_MAP,
) as MovementType[];

export function getMovementTypeColorClass(type: MovementType): string {
  return (
    MOVEMENT_TYPE_COLOR_MAP[type] ??
    "bg-muted text-muted-foreground border-border"
  );
}

export const INBOUND_NOTE_TYPE_COLOR_MAP: Record<InboundNoteType, string> = {
  purchase: "bg-green-200 text-green-800 border-green-600",
  return_from_site: "bg-purple-200 text-purple-800 border-purple-600",
};

export const INBOUND_NOTE_TYPE_LABEL_MAP: Record<InboundNoteType, string> = {
  purchase: "Nhập kho: mua hàng",
  return_from_site: "Nhập kho: trả lại hàng",
};

export const INBOUND_NOTE_TYPES: InboundNoteType[] = Object.keys(
  INBOUND_NOTE_TYPE_LABEL_MAP,
) as InboundNoteType[];

export function getInboundNoteTypeColorClass(type: InboundNoteType): string {
  return (
    INBOUND_NOTE_TYPE_COLOR_MAP[type] ??
    "bg-muted text-muted-foreground border-border"
  );
}

/**
 * Format số lượng có dấu: "100.000" → "+100.000", "-5.500" giữ nguyên.
 * Dấu dựa vào dữ liệu (không suy từ movementType - stocktake_adjustment/reversal có thể âm).
 */
export function formatSignedQuantity(quantity: string): string {
  const value = Number(quantity);
  if (value > 0) return `+${quantity}`;
  return quantity;
}
