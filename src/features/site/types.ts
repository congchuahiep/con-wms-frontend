import type { SimpleUser } from "@/features/auth";
import type { SimpleMaterial } from "@/features/material";
import type { SimpleWarehouse } from "@/features/warehouse";

export type SimpleWarehouseRef = {
  id: number;
  code: string;
  name: string;
};

export type SiteStatus = "active" | "completed" | "inactive";

export type Site = {
  id: number;
  code: string;
  name: string;
  manager: string;
  phone: string;
  address: string;
  note: string;
  /** Trạng thái công trường — thay thế isActive (bool). */
  status: SiteStatus;
  statusLabel: string;
  settledAt: string | null;
  settledBy: SimpleUser | null;
  /** Kho công trường liên kết (1-1, tự động tạo cùng công trường). */
  warehouse: SimpleWarehouseRef | null;
  createdAt: string;
  updatedAt: string;
};

export type SimpleSite = { id: number; code: string; name: string };

export type SiteInput = {
  code: string;
  name: string;
  manager: string;
  phone: string;
  address: string;
  note: string;
};

export type GetSitesParams = {
  search?: string;
  status?: SiteStatus | "all";
};

/**
 * Dòng trong bảng so sánh định mức vs tồn kho —
 * response `GET /api/sites/{id}/requirements/`.
 */
export type SiteRequirementRow = {
  material: SimpleMaterial;
  /** Định mức — null nghĩa là vật tư ngoài định mức (chỉ có tồn). */
  requiredQuantity: string | null;
  /** Tồn kho hiện tại của kho công trường (Decimal dạng chuỗi). */
  balance: string;
  status: "sufficient" | "insufficient" | "not_in_plan";
  /** Số lượng mặc định trả về khi tất toán. */
  defaultReturnQuantity: string;
  note: string | null;
};

export type RequirementLineInput = {
  materialId: number;
  quantity: string;
  note?: string;
};

export type RequirementsUpdateInput = {
  lines: RequirementLineInput[];
};

export type SettleLineInput = {
  materialId: number;
  quantity: string;
  note?: string;
};

export type SettleInput = {
  toWarehouseId: number;
  lines: SettleLineInput[];
};

export type SettleOutboundNote = {
  id: number;
  number: string;
  status: string;
  statusLabel: string;
  warehouse: SimpleWarehouse;
  toWarehouse: SimpleWarehouse;
  lines: {
    material: SimpleMaterial;
    quantity: string;
    note: string;
  }[];
};

export type SettleResponse = {
  site: Site;
  outboundNote: SettleOutboundNote;
};
