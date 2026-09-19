import type { StocktakeNoteDetail, StocktakeNoteInput, StocktakeNoteStatus } from "./types";
export const NOTE_STATUS_COLOR_MAP: Record<StocktakeNoteStatus, string> = { draft: "bg-muted text-muted-foreground border-border", posted: "bg-green-100 text-green-700 border-green-300", voided: "bg-red-100 text-red-700 border-red-300" };
export function getNoteStatusColorClass(s: StocktakeNoteStatus) { return NOTE_STATUS_COLOR_MAP[s] ?? "bg-muted text-muted-foreground border-border"; }
export function getTodayDateString() { return new Date().toISOString().slice(0, 10); }
export function toStocktakeNoteInput(d: StocktakeNoteDetail): StocktakeNoteInput { return { date: d.date, warehouseId: d.warehouse.id, note: d.note, lines: d.lines.map((l) => ({ materialId: l.material.id, difference: l.difference, reason: l.reason, note: l.note })) }; }
