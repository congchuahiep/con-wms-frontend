# Data Model — Material

> **v1.1** — Dùng `Paginated<T>` generic + `SimpleMaterialCategory` / `SimpleUnit`

## 1. Types

### `Material` — Response từ API (list item + detail)

| #   | Field         | Type                     | Required | Ghi chú                             |
| --- | ------------- | ------------------------ | -------- | ----------------------------------- |
| 1   | `id`          | `number`                 | ✅       | Primary key                         |
| 2   | `code`        | `string`                 | ✅       | Mã định danh (vd: "XM-HT-PCB40")    |
| 3   | `name`        | `string`                 | ✅       | Tên hiển thị                        |
| 4   | `category`    | `SimpleMaterialCategory` | ✅       | Nested object: `{ id, code, name }` |
| 5   | `unit`        | `SimpleUnit`             | ✅       | Nested object: `{ id, code, name }` |
| 6   | `description` | `string`                 | ✅       | Mô tả/quy cách kỹ thuật             |
| 7   | `isActive`    | `boolean`                | ✅       | Trạng thái kích hoạt                |
| 8   | `createdAt`   | `string`                 | ✅       | ISO timestamp                       |
| 9   | `updatedAt`   | `string`                 | ✅       | ISO timestamp                       |

```typescript
import type { SimpleMaterialCategory } from "@/features/material-category";
import type { SimpleUnit } from "@/features/unit";
import type { Paginated } from "@/types";

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
```

### Paginated response — Dùng generic `Paginated<T>` từ `src/types.ts`

```typescript
// GET list trả về Paginated<Material>
// Paginated<T> đã định nghĩa ở src/types.ts:
// { items: T[]; meta: { page, pageSize, total, totalPages, hasNextPage, hasPreviousPage } }
```

### Request type (POST/PATCH body)

| #   | Field         | Type     | Required | Ghi chú               |
| --- | ------------- | -------- | -------- | --------------------- |
| 1   | `code`        | `string` | ✅       | Mã định danh (max 30) |
| 2   | `name`        | `string` | ✅       | Tên hiển thị          |
| 3   | `categoryId`  | `number` | ✅       | FK → Category         |
| 4   | `unitId`      | `number` | ✅       | FK → Unit             |
| 5   | `description` | `string` | —        | Mô tả (default "")    |

## 2. Quan hệ

| Type A     | Cardinality | Type B             | Mô tả           |
| ---------- | ----------- | ------------------ | --------------- |
| `Material` | N→1         | `MaterialCategory` | `categoryId` FK |
| `Material` | N→1         | `Unit`             | `unitId` FK     |

## 3. External types (import từ feature khác)

| Type                     | Source                         | Dùng cho                                   |
| ------------------------ | ------------------------------ | ------------------------------------------ |
| `Paginated<T>`           | `@/types`                      | Wrapper paginated cho GET list             |
| `MaterialCategory`       | `@/features/material-category` | CategoryTree cho `CategorySelectField`     |
| `SimpleMaterialCategory` | `@/features/material-category` | Nested reference trong `Material.category` |
| `Unit`                   | `@/features/unit`              | `useGetUnits()` cho `UnitSelectField`      |
| `SimpleUnit`             | `@/features/unit`              | Nested reference trong `Material.unit`     |

## 4. Quyết định thiết kế

| #   | Quyết định                                               | Lý do                                                                                                                     |
| --- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| D1  | **Dùng `type` cho data shape**                           | `interface` chỉ cho React component props                                                                                 |
| D2  | **`category`/`unit` là nested object**                   | API trả về nested reference `{ id, code, name }`                                                                          |
| D3  | **Dùng `Paginated<T>` generic**                          | Tái sử dụng cho mọi entity paginated, định nghĩa ở `src/types.ts`                                                         |
| D4  | **POST/PATCH body dùng `categoryId`/`unitId` (flat ID)** | API nhận flat FK, không gửi nested object                                                                                 |
| D5  | **Update dùng PATCH + `usePartialUpdate`**               | Chỉ gửi dirty fields, tuân thủ convention                                                                                 |
| D6  | **DELETE trả về `204 No Content`**                       | Mutation trả về `void`                                                                                                    |
| D7  | **`CategorySelectField` flatten tree client-side**       | Pattern giống `create-dialog.tsx` — dùng `useGetCategories()` tree rồi flatten với indent `\u00A0\u00A0\u00A0` theo depth |
| D8  | **`UnitSelectField` nhóm theo `conversionType`**         | `"global"` → "Toàn cục", `"material"` → "Theo vật tư"                                                                     |
| D9  | **Simple type dùng tiền tố `Simple`**                    | `SimpleMaterialCategory` → `material-category/types.ts`, `SimpleUnit` → `unit/types.ts`                                   |
