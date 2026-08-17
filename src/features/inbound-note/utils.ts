import type {
  InboundNoteDetail,
  InboundNoteInput,
  InboundNoteStatus,
} from "./types";

export const NOTE_STATUS_COLOR_MAP: Record<InboundNoteStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  posted: "bg-green-100 text-green-700 border-green-300",
  voided: "bg-red-100 text-red-700 border-red-300",
};

export function getNoteStatusColorClass(status: InboundNoteStatus): string {
  return (
    NOTE_STATUS_COLOR_MAP[status] ??
    "bg-muted text-muted-foreground border-border"
  );
}

/** Ngày hôm nay dạng "YYYY-MM-DD" — initialInput cho field date. */
export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Chuyển chi tiết phiếu (response) thành input form sửa phiếu.
 * Map nested object → id (warehouse, supplier, lines).
 */
export function toInboundNoteInput(
  detail: InboundNoteDetail,
): InboundNoteInput {
  return {
    noteType: detail.noteType,
    date: detail.date,
    warehouseId: detail.warehouse.id,
    supplierId: detail.supplier?.id ?? null,
    note: detail.note,
    lines: detail.lines.map((line) => ({
      materialId: line.material.id,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      note: line.note,
    })),
  };
}
