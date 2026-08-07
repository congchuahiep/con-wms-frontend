# Data Model — Material Category

## 1. Interfaces / Types

### `MaterialCategory` — Response từ API (tree)

| #   | Field      | Type                 | Required | Ghi chú                                |
| --- | ---------- | -------------------- | -------- | -------------------------------------- |
| 1   | `id`       | `number`             | ✅       | Primary key                            |
| 2   | `code`     | `string`             | ✅       | Mã định danh (vd: "VLXD", "XM")        |
| 3   | `name`     | `string`             | ✅       | Tên hiển thị (vd: "Vật liệu xây dựng") |
| 4   | `color`    | `string \| null`     | —        | Màu hiển thị badge, nullable           |
| 5   | `parent`   | `number \| null`     | —        | ID node cha, `null` = root             |
| 6   | `children` | `MaterialCategory[]` | ✅       | Danh sách node con (rỗng nếu là lá)    |
| 7   | `isActive` | `boolean`            | ✅       | Trạng thái kích hoạt                   |

```typescript
export type MaterialCategory = {
  id: number;
  code: string;
  name: string;
  color: string | null;
  parent: number | null;
  children: MaterialCategory[];
  isActive: boolean;
};
```

### `FlatCategory` — Dạng phẳng (cho select box, dùng `?flat=true`)

_Dùng sau này, khi cần select parent trong dialog tạo mới._

| #   | Field      | Type             | Ghi chú                     |
| --- | ---------- | ---------------- | --------------------------- |
| 1   | `id`       | `number`         |                             |
| 2   | `code`     | `string`         |                             |
| 3   | `name`     | `string`         |                             |
| 4   | `color`    | `string \| null` |                             |
| 5   | `parent`   | `number \| null` |                             |
| 6   | `depth`    | `number`         | Độ sâu trong cây (0 = root) |
| 7   | `isActive` | `boolean`        |                             |

```typescript
export type FlatCategory = {
  id: number;
  code: string;
  name: string;
  color: string | null;
  parent: number | null;
  depth: number;
  isActive: boolean;
};
```

## 2. Enums / Union Types

### `MaterialCategoryColor` — Các màu được hỗ trợ

Frontend kiểm soát danh sách màu. Backend lưu string tự do, nhưng client dùng union type này để map sang CSS class/hex.

```typescript
export type MaterialCategoryColor =
    | "red"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "green"
    | "emerald"
    | "teal"
    | "cyan"
    | "sky"
    | "blue"
    | "indigo"
    | "violet"
    | "purple"
    | "fuchsia"
    | "pink"
    | "rose"
    | "slate"
    | "gray"
    | "zinc"
    | "neutral"
    | "stone";
```

### `CATEGORY_COLOR_MAP` — Map màu → Tailwind class

```typescript
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
```

### Helper: `getCategoryColorClass(color: string | null): string`

Trả về Tailwind class dựa trên `color`. Nếu `null` hoặc không khớp → fallback `"bg-muted text-muted-foreground border-border"`.

```typescript
export function getCategoryColorClass(color: string | null): string {
    if (!color) return "bg-muted text-muted-foreground border-border";
    return (
        CATEGORY_COLOR_MAP[color as MaterialCategoryColor] ??
        "bg-muted text-muted-foreground border-border"
    );
}
```

## 3. Quan hệ

| Type A             | Cardinality | Type B             | Mô tả                                               |
| ------------------ | ----------- | ------------------ | --------------------------------------------------- |
| `MaterialCategory` | 1→N (self)  | `MaterialCategory` | `parent` FK trỏ đến chính nó, `children[]` chứa con |

## 4. Quyết định thiết kế

| #   | Quyết định                                                      | Lý do                                                                                                                                                                                                                                                                           |
| --- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **Dùng `type` cho mọi data shape**                              | Pattern của dự án: `type` cho data objects, `type` cho union/enum. `interface` chỉ dùng cho React component props.                                                                                                                                                              |
| D2  | **`MaterialCategoryColor` là union type do frontend kiểm soát** | Backend lưu string tự do. Frontend định nghĩa danh sách màu + map Tailwind để đảm bảo hiển thị nhất quán.                                                                                                                                                                       |
| D3  | **`color` field nullable, fallback = muted**                    | API trả về `null` nếu chưa set. UI fallback về màu xám nhạt.                                                                                                                                                                                                                    |
| D4  | **Dùng TanStack Table native `getSubRows` cho tree**            | TanStack Table v8 hỗ trợ tree natively qua `getSubRows: (row) => row.children`. Không cần flatten thủ công. `row.depth` tự động có khi dùng `getSubRows`, dùng để indent. `row.getCanExpand()`, `row.getIsExpanded()`, `row.getToggleExpandedHandler()` cho expand/collapse UI. |
| D5  | **Search/filter client-side**                                   | Dữ liệu ≤ 30 items, đã load hết về client. Filter theo `name` hoặc `code` bằng `useMemo` + `useState`. Có thể dùng `globalFilter` của TanStack Table hoặc filter riêng trước khi đưa vào table.                                                                                 |
