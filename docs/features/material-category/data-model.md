# Data Model — Material Category

> **v1.2** — Thêm `description`, giảm màu 22→10

## 1. Types

### `MaterialCategory` — Response từ API (tree)

| # | Field | Type | Required | Ghi chú |
|---|---|---|---|---|
| 1 | `id` | `number` | ✅ | Primary key |
| 2 | `code` | `string` | ✅ | Mã định danh (vd: "VLXD", "XM") |
| 3 | `name` | `string` | ✅ | Tên hiển thị |
| 4 | `description` | `string` | ✅ | Mô tả danh mục |
| 5 | `color` | `string \| null` | — | Màu hiển thị badge, nullable |
| 6 | `parent` | `number \| null` | — | ID node cha, `null` = root |
| 7 | `children` | `MaterialCategory[]` | ✅ | Node con (rỗng nếu lá) |
| 8 | `isActive` | `boolean` | ✅ | Trạng thái kích hoạt |

```typescript
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
```

### Request type (POST body)

| # | Field | Type | Required | Ghi chú |
|---|---|---|---|---|
| 1 | `code` | `string` | ✅ | Mã định danh |
| 2 | `name` | `string` | ✅ | Tên hiển thị |
| 3 | `description` | `string` | — | Mô tả (default "") |
| 4 | `color` | `string \| null` | — | Màu (default null) |
| 5 | `parentId` | `number \| null` | — | ID node cha (default null = root) |

## 2. Enums / Union Types

### `MaterialCategoryColor` — 10 màu

```typescript
export type MaterialCategoryColor =
  | "red" | "orange" | "yellow"
  | "green" | "teal" | "blue"
  | "indigo" | "purple" | "pink"
  | "gray";
```

### `CATEGORY_COLOR_MAP`

```typescript
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
```

### `getCategoryColorClass(color: string | null): string`

Fallback `null` → `"bg-muted text-muted-foreground border-border"`.

## 3. Quan hệ

| Type A | Cardinality | Type B | Mô tả |
|---|---|---|---|
| `MaterialCategory` | 1→N (self) | `MaterialCategory` | `parent` FK, `children[]` |

## 4. Quyết định thiết kế

| # | Quyết định | Lý do |
|---|---|---|
| D1 | **Dùng `type` cho data shape** | `interface` chỉ cho React component props |
| D2 | **`MaterialCategoryColor` 10 màu** | Đủ phân biệt, không quá dài cho SelectField |
| D3 | **`color` nullable, fallback muted** | API null → UI xám nhạt |
| D4 | **TanStack Table `getSubRows` cho tree** | Native support, không cần flatten thủ công |
| D5 | **Search/filter client-side** | ≤ 30 items |
| D6 | **`description` default `""`** | Optional, backend trả về string |
| D7 | **POST dùng `parentId` (camelCase)** | Pattern Material API |
| D8 | **SelectField cho parent + color** | Nhất quán, reusable, tránh ColorPicker riêng |
| D9 | **Flatten tree client-side cho parent** | Dùng `useGetCategories()` có sẵn, không cần `?flat=true` |
| D10 | **SelectField có `renderOption` prop** | Custom render: chấm màu cho color, indent cho parent |
| D11 | **Dialog unmount → form auto-reset** | `open ? <Dialog /> : null` + `resetOnSuccess: true` |
