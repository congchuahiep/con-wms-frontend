# Data Model — Supplier (Nhà cung cấp)

> **v0.1** — Thiết kế ban đầu

## 1. Types

### `Supplier` — Response từ API

| #   | Field           | Type      | Required | Ghi chú                          |
| --- | --------------- | --------- | -------- | -------------------------------- |
| 1   | `id`            | `number`  | ✅       | Primary key                      |
| 2   | `code`          | `string`  | ✅       | Mã NCC (vd: "NCC001")            |
| 3   | `name`          | `string`  | ✅       | Tên nhà cung cấp                 |
| 4   | `taxCode`       | `string`  | —        | Mã số thuế (MST), có thể rỗng    |
| 5   | `contactPerson` | `string`  | —        | Người liên hệ                    |
| 6   | `phone`         | `string`  | —        | SĐT liên hệ                      |
| 7   | `email`         | `string`  | —        | Email liên hệ                    |
| 8   | `address`       | `string`  | —        | Địa chỉ                          |
| 9   | `note`          | `string`  | —        | Ghi chú                          |
| 10  | `isActive`      | `boolean` | ✅       | Trạng thái hợp tác (soft delete) |
| 11  | `createdAt`     | `string`  | ✅       | ISO datetime                     |
| 12  | `updatedAt`     | `string`  | ✅       | ISO datetime                     |

```typescript
export type Supplier = {
    id: number;
    code: string;
    name: string;
    taxCode: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    note: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};
```

### Request type (POST/PATCH body)

Giống `Supplier` nhưng **không gửi** `id`, `isActive`, `createdAt`, `updatedAt`. Các field optional có default `""`.

```typescript
export type SupplierInput = {
    code: string;
    name: string;
    taxCode: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    note: string;
};
```

## 2. Schema (Valibot)

```typescript
import * as v from "valibot";

export const SupplierSchema = v.object({
    code: v.pipe(
        v.string("Mã NCC phải là chuỗi"),
        v.nonEmpty("Mã NCC không được để trống"),
        v.regex(
            /^[a-zA-Z0-9_]+$/,
            "Mã NCC chỉ được chứa chữ cái, số và dấu gạch dưới",
        ),
        v.maxLength(20, "Mã NCC tối đa 20 ký tự"),
    ),
    name: v.pipe(
        v.string("Tên NCC phải là chuỗi"),
        v.nonEmpty("Tên NCC không được để trống"),
        v.maxLength(200, "Tên NCC tối đa 200 ký tự"),
    ),
    taxCode: v.optional(v.string(), ""),
    contactPerson: v.optional(v.string(), ""),
    phone: v.optional(v.string(), ""),
    email: v.optional(
        v.union([
            v.literal(""),
            v.pipe(
                v.string("Email phải là chuỗi"),
                v.email("Email không đúng định dạng"),
            ),
        ]),
        "",
    ),
    address: v.optional(v.string(), ""),
    note: v.optional(v.string(), ""),
});
```

## 3. Enums / Union Types

Không có enum riêng. Entity này không có trường nào cần `TextChoices`/union client-side.

## 4. Quan hệ

| Type A | Cardinality | Type B | Mô tả                                |
| ------ | ----------- | ------ | ------------------------------------ |
| —      | —           | —      | Không có quan hệ (data master phẳng) |

## 5. Quyết định thiết kế

| #   | Quyết định                                             | Lý do                                                               |
| --- | ------------------------------------------------------ | ------------------------------------------------------------------- |
| D1  | **Dùng `type` cho data shape**                         | `interface` chỉ cho React component props                           |
| D2  | **Không có `utils.ts`**                                | Không có color map/enum/helper runtime (khác `material-category`)   |
| D3  | **`isActive` trong type nhưng không trong schema**     | Soft delete qua nút DELETE, không toggle trong form                 |
| D4  | **List trả về `Supplier[]` (mảng phẳng)**              | Backend `pagination_class = None` — không paginate                  |
| D5  | **Search server-side qua `?search=`**                  | Backend `SearchFilter` trên `code` + `name`                         |
| D6  | **Edit pre-fill trực tiếp từ row, không fetch detail** | List đã trả về full object, không cần `useGetSupplier`              |
| D7  | **`code` regex `^[a-zA-Z0-9_]+$` max 20**              | Nhất quán với `Warehouse`                                           |
| D8  | **`email` validate `v.email` khi non-empty**           | UX tốt hơn; empty allowed                                           |
| D9  | **`taxCode` unique do backend validate**               | `setFieldErrors` tự map lỗi server về field                         |
| D10 | **Update dùng `PATCH` + `usePartialUpdate`**           | Convention frontend; backend `ModelViewSet` hỗ trợ `partial_update` |
