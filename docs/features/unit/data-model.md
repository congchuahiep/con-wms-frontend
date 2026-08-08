# Data Model — Unit

> **v1.1** — Cập nhật theo Django model thực tế

## 1. Types

### `Unit` — Response từ API GET list

Response đầy đủ từ `UnitSerializer` gồm: `id`, `code`, `name`, `is_active`, `created_at`, `updated_at`.
Frontend chỉ cần 4 field chính (bỏ `createdAt`, `updatedAt` — nhất quán với MaterialCategory pattern).

| #   | Field      | Type      | Required | Ghi chú                                              |
| --- | ---------- | --------- | -------- | ---------------------------------------------------- |
| 1   | `id`       | `number`  | ✅       | Primary key (BigAutoField)                           |
| 2   | `code`     | `string`  | ✅       | Mã định danh, unique, max 10 ký tự (vd: "BAO", "KG") |
| 3   | `name`     | `string`  | ✅       | Tên hiển thị, max 100 ký tự (vd: "Bao", "Kilogram")  |
| 4   | `isActive` | `boolean` | ✅       | Trạng thái kích hoạt (default: true)                 |

```typescript
export type Unit = {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
};
```

### Request type (POST/PUT body)

| #   | Field  | Type     | Required | DB constraint                  |
| --- | ------ | -------- | -------- | ------------------------------ |
| 1   | `code` | `string` | ✅       | `max_length=10`, `unique=True` |
| 2   | `name` | `string` | ✅       | `max_length=100`               |

## 2. Quan hệ

Không có quan hệ phức tạp. Unit là entity độc lập, phẳng.

| Type A | Cardinality | Type B | Mô tả                          |
| ------ | ----------- | ------ | ------------------------------ |
| `Unit` | —           | —      | Không có FK, không có children |

## 3. Quyết định thiết kế

| #   | Quyết định                                | Lý do                                                          |
| --- | ----------------------------------------- | -------------------------------------------------------------- |
| D1  | **Dùng `type` cho data shape**            | Interface chỉ cho React component props                        |
| D2  | **Không có `utils.ts`**                   | Unit không có color map hay helper phức tạp                    |
| D3  | **Schema chỉ validate `code` + `name`**   | Backend chỉ nhận 2 field này                                   |
| D4  | **`code` maxLength = 10**                 | Khớp Django model `max_length=10`                              |
| D5  | **`name` maxLength = 100**                | Khớp Django model `max_length=100`                             |
| D6  | **Regex `code`: `^[a-zA-Z0-9_]+$`**       | Cho phép chữ, số, gạch dưới — phù hợp mã đơn vị như "M3", "KG" |
| D7  | **Search/filter client-side**             | ≤ 20 items, không pagination                                   |
| D8  | **Table phẳng, không `getSubRows`**       | Không có cấu trúc cây                                          |
| D9  | **PUT dùng `usePartialUpdate`**           | Chỉ gửi field thay đổi                                         |
| D10 | **Bỏ `createdAt`, `updatedAt` khỏi type** | Không dùng ở UI list, nhất quán MaterialCategory               |
