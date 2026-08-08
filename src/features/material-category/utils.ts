import type { MaterialCategoryColor } from "./types";

export const CATEGORY_COLOR_MAP: Record<MaterialCategoryColor, string> = {
  red: "bg-red-100 text-red-700 border-red-300",
  orange: "bg-orange-100 text-orange-700 border-orange-300",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
  green: "bg-green-100 text-green-700 border-green-300",
  teal: "bg-teal-100 text-teal-700 border-teal-300",
  blue: "bg-blue-100 text-blue-700 border-blue-300",
  indigo: "bg-indigo-100 text-indigo-700 border-indigo-300",
  purple: "bg-purple-100 text-purple-700 border-purple-300",
  pink: "bg-pink-100 text-pink-700 border-pink-300",
  gray: "bg-gray-100 text-gray-700 border-gray-300",
};

export function getCategoryColorClass(color: string | null): string {
  if (!color) return "bg-muted text-muted-foreground border-border";
  return (
    CATEGORY_COLOR_MAP[color as MaterialCategoryColor] ??
    "bg-muted text-muted-foreground border-border"
  );
}

export const CATEGORY_COLOR_LABELS: Record<MaterialCategoryColor, string> = {
  red: "Đỏ",
  orange: "Cam",
  yellow: "Vàng",
  green: "Xanh lá",
  teal: "Xanh dương",
  blue: "Xanh dương",
  indigo: "Indigo",
  purple: "Tím",
  pink: "Hồng",
  gray: "Xám",
};

export function getCategoryColorLabel(color: string | null): string {
  if (!color) return "Màu mặc định";
  return (
    CATEGORY_COLOR_LABELS[color as MaterialCategoryColor] ?? "Màu mặc định"
  );
}
