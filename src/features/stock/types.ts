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
 * Tồn của 1 vật tư tại 1 kho — entry trong `StockBalanceSummary.warehouseBalances`.
 * Giá trị tồn theo kho tính tại UI bằng giá nhập gần nhất CỦA VẬT TƯ, không lưu giá theo kho.
 */
export type StockBalanceWarehouse = {
  warehouse: SimpleWarehouse;
  /** Tồn tại kho này — Decimal(14,3) dạng string, không dấu. */
  quantity: string;
};

/**
 * Tồn kho gộp theo vật tư (tổng mọi kho) — dòng hiển thị trên trang Tồn kho.
 * Backend trả theo cặp (warehouse, material) nên client dựng view này bằng
 * `aggregateStockBalances()` (utils.ts): mỗi vật tư đúng 1 dòng, không phụ
 * thuộc kho; mở rộng dòng để xem tồn theo từng kho (`warehouseBalances`).
 */
export type StockBalanceSummary = {
  material: SimpleMaterial;
  unit: SimpleUnit;
  /** Tổng tồn ở mọi kho — Decimal(14,3) dạng string. */
  totalQuantity: string;
  /**
   * Giá nhập gần nhất của vật tư — lấy giá cao nhất trong các kho (client
   * không xác định được thứ tự thời gian giữa các dòng); null nếu chưa từng nhập mua.
   */
  lastPurchasePrice: string | null;
  /** Tổng giá trị tồn mọi kho = Σ (quantity × giá); null nếu mọi kho đều chưa có giá. */
  totalStockValue: string | null;
  /** Tồn theo từng kho đang giữ vật tư này (quantity ≠ 0) — dùng cho expanded row. */
  warehouseBalances: StockBalanceWarehouse[];
};

/**
 * Loại phiếu nguồn của dòng sổ kho — đồng bộ 3 nhóm trang `/notes/<type>` ở frontend.
 */
export type SourceNoteType = "inbound" | "outbound" | "stocktake";

/**
 * Phiếu nguồn sinh ra dòng sổ kho — response `GET /api/stock/movements/` (field `sourceNote`).
 * `noteType` tự mô tả loại phiếu nên UI không phải map `movementType` → field;
 * lưu ý dòng nhập do điều chuyển (`inbound_transfer_from_warehouse`) trỏ về CÙNG
 * phiếu xuất điều chuyển nên `noteType = "outbound"`.
 */
export type SourceNoteRef = {
  id: number;
  /** Số phiếu: "PN-...", "PX-...", "PK-..." */
  number: string;
  noteType: SourceNoteType;
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
  /**
   * Phiếu nguồn — v1.7: thay `inboundNote`. Hiện mọi dòng đều có phiếu nguồn,
   * giữ `| null` để an toàn cho tương lai (dòng điều chỉnh không thuộc phiếu nào).
   */
  sourceNote: SourceNoteRef | null;
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
