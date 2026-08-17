import type { SimpleUser } from "@/features/auth";
import type { SimpleMaterial } from "@/features/material";
import type { SimpleUnit } from "@/features/unit";
import type { SimpleWarehouse } from "@/features/warehouse";

/**
 * Loại dòng sổ kho — khớp `MovementType` TextChoices của backend.
 * Label tiếng Việt do backend trả sẵn qua `movementTypeLabel`.
 */
export type MovementType =
  | "inbound_purchase_from_supplier"
  | "inbound_return_from_site"
  | "outbound_issue_for_use"
  | "outbound_transfer_to_warehouse"
  | "inbound_transfer_from_warehouse"
  | "stocktake_adjustment";

/**
 * Tồn kho hiện tại theo (warehouse, material) — response `GET /api/stock/`.
 * Decimal trả về dạng string, không parse sang number.
 */
export type StockBalance = {
  material: SimpleMaterial;
  unit: SimpleUnit;
  warehouse: SimpleWarehouse;
  quantity: string;
  lastPurchasePrice: string | null;
  stockValue: string | null;
};

/**
 * Dòng sổ kho — response `GET /api/stock/movements/`.
 * `quantity` có dấu: nhập +, xuất −.
 */
export type StockMovement = {
  id: number;
  movementType: MovementType;
  movementTypeLabel: string;
  date: string;
  material: SimpleMaterial;
  warehouse: SimpleWarehouse;
  quantity: string;
  unitPrice: string | null;
  inboundNote: { id: number; number: string } | null;
  reversalOf: number | null;
  reason: string;
  createdBy: SimpleUser;
  createdAt: string;
};

export type GetStockParams = {
  warehouse?: number;
  material?: number;
  category?: number;
  search?: string;
  hasStock?: boolean;
};

export type GetStockMovementsParams = {
  material?: number;
  warehouse?: number;
  movementType?: MovementType;
  dateFrom?: string;
  dateTo?: string;
  inboundNote?: number;
  originalsOnly?: boolean;
  page?: number;
  pageSize?: number;
};
