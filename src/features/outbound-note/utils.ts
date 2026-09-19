import type { OutboundNoteDetail, OutboundNoteInput, OutboundNoteStatus } from "./types";

export const NOTE_STATUS_COLOR_MAP: Record<OutboundNoteStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  posted: "bg-green-100 text-green-700 border-green-300",
  voided: "bg-red-100 text-red-700 border-red-300",
};
export function getNoteStatusColorClass(s: OutboundNoteStatus) { return NOTE_STATUS_COLOR_MAP[s] ?? "bg-muted text-muted-foreground border-border"; }
export function getTodayDateString() { return new Date().toISOString().slice(0, 10); }
export function toOutboundNoteInput(d: OutboundNoteDetail): OutboundNoteInput {
  return { noteType: d.noteType, date: d.date, warehouseId: d.warehouse.id, siteId: d.site?.id ?? null, toWarehouseId: d.toWarehouse?.id ?? null, note: d.note, lines: d.lines.map((l) => ({ materialId: l.material.id, quantity: l.quantity, note: l.note })) };
}
