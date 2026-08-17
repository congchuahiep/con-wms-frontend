import type { SimpleUser } from "@/features/auth";
import type { SimpleMaterial } from "@/features/material";
import type { SimpleSupplier } from "@/features/supplier";
import type { SimpleWarehouse } from "@/features/warehouse";

export type InboundNoteType = "purchase" | "return_from_site";

/** Vòng đời phiếu: draft → posted → voided (phiếu đã chốt bất biến). */
export type InboundNoteStatus = "draft" | "posted" | "voided";

export type InboundNoteLine = {
  id: number;
  material: SimpleMaterial;
  quantity: string;
  unitPrice: string;
  lineNo: number;
  note: string;
};

/** Item danh sách `GET /api/inbound-notes/` — không kèm lines. */
export type InboundNote = {
  id: number;
  number: string;
  noteType: InboundNoteType;
  noteTypeLabel: string;
  status: InboundNoteStatus;
  statusLabel: string;
  date: string;
  warehouse: SimpleWarehouse;
  supplier: SimpleSupplier | null;
  createdBy: SimpleUser;
  totalAmount: string;
  totalQuantity: number;
  note: string;
  voidedBy: SimpleUser | null;
  voidedAt: string | null;
  voidReason: string;
  createdAt: string;
  updatedAt: string;
};

/** Chi tiết `GET /api/inbound-notes/{id}/` + response POST/PUT — kèm lines. */
export type InboundNoteDetail = InboundNote & {
  lines: InboundNoteLine[];
};

export type InboundNoteLineInput = {
  materialId: number;
  quantity: string;
  unitPrice: string;
  note: string;
};

/** Body POST/PUT — nested write: phiếu + lines trong 1 request. */
export type InboundNoteInput = {
  noteType: InboundNoteType;
  date: string;
  warehouseId: number;
  supplierId: number | null;
  note: string;
  lines: InboundNoteLineInput[];
};

export type GetInboundNotesParams = {
  noteType?: InboundNoteType;
  status?: InboundNoteStatus;
  warehouse?: number;
  supplier?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};
