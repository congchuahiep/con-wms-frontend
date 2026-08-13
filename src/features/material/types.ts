import type { SimpleMaterialCategory } from "@/features/material-category";
import type { SimpleUnit } from "@/features/unit";

export type Material = {
  id: number;
  code: string;
  name: string;
  category: SimpleMaterialCategory;
  unit: SimpleUnit;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Input cho nested write: frontend gửi `toUnitId` + `factor`. */
export type MaterialConversionInput = {
  toUnitId: number | null;
  factor: string;
};

/** Output read-only: nested conversion trong `MaterialDetail`. */
export type MaterialConversion = {
  id: number;
  toUnit: SimpleUnit;
  factor: string;
};

/** Response từ `GET /api/materials/{id}/` — kèm danh sách quy đổi. */
export type MaterialDetail = Material & {
  conversions: MaterialConversion[];
};
