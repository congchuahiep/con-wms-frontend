import type { MaterialCategoryColor } from "./types";

export const CATEGORY_COLOR_MAP: Record<MaterialCategoryColor, string> = {
  red: "bg-red-100 text-red-700 border-red-300",
  orange: "bg-orange-100 text-orange-700 border-orange-300",
  amber: "bg-amber-100 text-amber-700 border-amber-300",
  yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
  lime: "bg-lime-100 text-lime-700 border-lime-300",
  green: "bg-green-100 text-green-700 border-green-300",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-300",
  teal: "bg-teal-100 text-teal-700 border-teal-300",
  cyan: "bg-cyan-100 text-cyan-700 border-cyan-300",
  sky: "bg-sky-100 text-sky-700 border-sky-300",
  blue: "bg-blue-100 text-blue-700 border-blue-300",
  indigo: "bg-indigo-100 text-indigo-700 border-indigo-300",
  violet: "bg-violet-100 text-violet-700 border-violet-300",
  purple: "bg-purple-100 text-purple-700 border-purple-300",
  fuchsia: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300",
  pink: "bg-pink-100 text-pink-700 border-pink-300",
  rose: "bg-rose-100 text-rose-700 border-rose-300",
  slate: "bg-slate-100 text-slate-700 border-slate-300",
  gray: "bg-gray-100 text-gray-700 border-gray-300",
  zinc: "bg-zinc-100 text-zinc-700 border-zinc-300",
  neutral: "bg-neutral-100 text-neutral-700 border-neutral-300",
  stone: "bg-stone-100 text-stone-700 border-stone-300",
};

export function getCategoryColorClass(color: string | null): string {
  if (!color) return "bg-muted text-muted-foreground border-border";
  return (
    CATEGORY_COLOR_MAP[color as MaterialCategoryColor] ??
    "bg-muted text-muted-foreground border-border"
  );
}
