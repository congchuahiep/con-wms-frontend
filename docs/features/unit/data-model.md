# Data Model — Unit

> **v1.0** — Khởi tạo

## 1. Types

### `Unit` — Response từ API (phẳng)

| # | Field | Type | Required | Ghi chú |
|---|---|---|---|---|
| 1 | `id` | `number` | ✅ | Primary key |
| 2 | `code` | `string` | ✅ | Mã định danh (vd: "BAO", "KG", "TAN") |
| 3 | `name` | `string` | ✅ | Tên hiển thị (vd: "Bao", "Kilogram") |
| 4 | `isActive` | `boolean` | ✅ | Trạng thái kích hoạt |

```typescript
export type Unit = {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
};
```

### Request type (POST/PUT body)

| # | Field | Type | Required | Ghi chú |
|---|---|---|---|---|
| 1 | `code` | `string` | ✅ | Mã đơn vị |
| 2 | `name` | `string` | ✅ | Tên đơn vị |

## 2. Quan hệ

Không có quan hệ phức tạp. Unit là entity độc lập, phẳng.

| Type A | Cardinality | Type B | Mô tả |
|---|---|---|---|
| `Unit` | — | — | Không có FK, không có children |

## 3. Quyết định thiết kế

| # | Quyết định | Lý do |
|---|---|---|
| D1 | **Dùng `type` cho data shape** | Interface chỉ cho React component props |
| D2 | **Không có `utils.ts`** | Unit không có color map hay helper phức tạp |
| D3 | **Schema chỉ validate `code` + `name`** | Backend chỉ nhận 2 field này |
| D4 | **Search/filter client-side** | ≤ 20 items |
| D5 | **Table phẳng, không `getSubRows`** | Không có cấu trúc cây |
| D6 | **PUT dùng `usePartialUpdate`** | Chỉ gửi field thay đổi |
