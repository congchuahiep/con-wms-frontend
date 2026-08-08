export type MaterialCategory = {
  id: number;
  code: string;
  name: string;
  description: string;
  color: string | null;
  parent: number | null;
  children: MaterialCategory[];
  isActive: boolean;
};

/**
 * Dạng phẳng cho select box (dùng với ?flat=true).
 * Sẽ dùng sau này khi cần chọn parent trong dialog create/edit.
 */
export type FlatCategory = {
  id: number;
  code: string;
  name: string;
  description: string;
  color: string | null;
  parent: number | null;
  depth: number;
  isActive: boolean;
};

export type MaterialCategoryColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "gray";
