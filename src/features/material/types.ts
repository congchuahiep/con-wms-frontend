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
