/** Số lượng phiếu nháp (draft) — GET /api/draft-count/ */
export interface DraftNoteCount {
  inboundNotes: number;
  outboundNotes: number;
  stocktakeNotes: number;
  total: number;
}

/** Map mã tab ↔ field tương ứng trong `DraftNoteCount` */
export const DRAFT_COUNT_FIELD = {
  inbound: "inboundNotes",
  outbound: "outboundNotes",
  stocktake: "stocktakeNotes",
} as const satisfies Record<string, keyof DraftNoteCount>;

export type NoteType = keyof typeof DRAFT_COUNT_FIELD;
