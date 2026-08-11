import type { SimpleUnit } from "../unit/types";

export type UnitConversion = {
  id: number;
  toUnit: SimpleUnit;
  fromUnit: SimpleUnit;
  factor: string;
  material: any | null;
  isReverse: boolean;
};
