import type { SimpleUser } from "@/features/auth";
import type { SimpleMaterial } from "@/features/material";
import type { SimpleSite } from "@/features/site";
import type { SimpleWarehouse } from "@/features/warehouse";

export type OutboundNoteType = "issue_for_use" | "transfer";
export type OutboundNoteStatus = "draft" | "posted" | "voided";

export type OutboundNoteLine = {
  id: number;
  material: SimpleMaterial;
  quantity: string;
  lineNo: number;
  note: string;
};

export type OutboundNote = {
  id: number;
  number: string;
  noteType: OutboundNoteType;
  noteTypeLabel: string;
  status: OutboundNoteStatus;
  statusLabel: string;
  date: string;
  warehouse: SimpleWarehouse;
  toWarehouse: SimpleWarehouse | null;
  site: SimpleSite | null;
  createdBy: SimpleUser;
  totalQuantity: number;
  note: string;
  voidedBy: SimpleUser | null;
  voidedAt: string | null;
  voidReason: string;
  createdAt: string;
  updatedAt: string;
};

export type OutboundNoteDetail = OutboundNote & { lines: OutboundNoteLine[] };

export type OutboundNoteLineInput = { materialId: number; quantity: string; note: string };
export type OutboundNoteInput = {
  noteType: OutboundNoteType;
  date: string;
  warehouseId: number;
  siteId: number | null;
  toWarehouseId: number | null;
  note: string;
  lines: OutboundNoteLineInput[];
};

export type GetOutboundNotesParams = {
  noteType?: OutboundNoteType;
  status?: OutboundNoteStatus;
  warehouse?: number;
  toWarehouse?: number;
  site?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};
