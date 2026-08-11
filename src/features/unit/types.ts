import type { UnitConversion } from "../unit-conversion";

export type Unit = {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  conversionType: UnitConversionType;
};

export type DetailedUnit = Unit & {
  conversions: UnitConversion[];
};

export type SimpleUnit = {
  id: number;
  code: string;
  name: string;
};

type UnitConversionType = "global" | "material";
