# UnitConversion — Data Model & API Spec

> **v2.0** — Hỗ trợ quy đổi theo vật tư (`material`). Bỏ `globalConversions` (đã merge vào `conversions`).

## 1. Types

### `SimpleMaterial` — Import từ `material` feature

```typescript
import type { SimpleMaterial } from "@/features/material";
```

### `UnitConversion` — Response từ API

| #   | Field       | Type                     | Required | Ghi chú                                         |
| --- | ----------- | ------------------------ | -------- | ----------------------------------------------- |
| 1   | `id`        | `number`                 | ✅       | Primary key                                     |
| 2   | `fromUnit`  | `SimpleUnit`             | ✅       | Đơn vị nguồn                                    |
| 3   | `toUnit`    | `SimpleUnit`             | ✅       | Đơn vị đích                                     |
| 4   | `factor`    | `string`                 | ✅       | Hệ số quy đổi (Decimal, dạng string)            |
| 5   | `material`  | `SimpleMaterial \| null` | ✅       | `null` nếu global; object nếu material-specific |
| 6   | `isReverse` | `boolean`                | ✅       | `true` nếu đây là chiều ngược (chỉ global)      |

```typescript
import type { SimpleUnit } from "../unit/types";
import type { SimpleMaterial } from "../material/types";

export type UnitConversion = {
    id: number;
    toUnit: SimpleUnit;
    fromUnit: SimpleUnit;
    factor: string;
    material: SimpleMaterial | null;
    isReverse: boolean;
};
```

### `DetailedUnit` — Response từ `GET /api/units/{id}/`

```typescript
export type DetailedUnit = Unit & {
    conversions: UnitConversion[]; // đã merge direct + reverse (global), và direct (material)
};
```

> **Lưu ý:** Không còn tách `globalConversions`. Backend `DetailedUnitSerializer.get_conversions` đã merge direct + reverse vào `conversions`.

### `UnitConversionType` — cần export từ `unit/types.ts`

```typescript
// src/features/unit/types.ts — ĐANG LÀ type private, cần export
export type UnitConversionType = "global" | "material";
```

> `useAddConversion` cần nhận `conversionType` để chọn schema. Hiện tại `UnitConversionType` chưa được export — phải thêm `export` khi triển khai.

---

## 2. API Endpoints

| Method   | Endpoint                       | Mô tả                              | Permission           |
| -------- | ------------------------------ | ---------------------------------- | -------------------- |
| `GET`    | `/api/units/{id}/`             | Chi tiết unit + danh sách quy đổi  | IsAuthenticated      |
| `POST`   | `/api/units/{id}/conversions/` | Tạo quy đổi (global hoặc material) | IsAdminOrStorekeeper |
| `PATCH`  | `/api/unit-conversions/{id}/`  | Cập nhật hệ số quy đổi             | IsAdminOrStorekeeper |
| `DELETE` | `/api/unit-conversions/{id}/`  | Xoá quy đổi                        | IsAdminOrStorekeeper |

---

## 3. Request / Response

### `POST /api/units/{id}/conversions/`

Request phụ thuộc `unit.conversionType`:

**Global (`conversionType: "global"`):** không gửi `materialId`

```json
{
    "toUnitId": 2,
    "factor": "1000"
}
```

**Material (`conversionType: "material"`):** bắt buộc gửi `materialId`

```json
{
    "toUnitId": 2,
    "factor": "50",
    "materialId": 1
}
```

Response luôn là `UnitConversion` (có `material` ở dạng nested hoặc `null`).

### `PATCH /api/unit-conversions/{id}/`

Chỉ cập nhật `factor` (partial). `material` **không** được edit sau tạo.

```json
{ "factor": "1200" }
```

---

## 4. Schema Validation (Valibot)

### Tách 2 schema theo `conversionType`

```typescript
// Shared fields
const conversionBase = {
    toUnitId: v.pipe(
        v.nullable(v.number()),
        v.transform((input) => input ?? 0),
        v.minValue(1, "Vui lòng chọn đơn vị đích"),
    ),
    factor: v.pipe(
        v.string(),
        v.toNumber("Hệ số phải là số"),
        v.number("Hệ số phải là số"),
        v.minValue(0.0001, "Hệ số phải lớn hơn 0"),
    ),
};

// Global: chỉ toUnitId + factor
export const GlobalConversionSchema = v.object(conversionBase);

// Material: thêm materialId bắt buộc
export const MaterialConversionSchema = v.object({
    ...conversionBase,
    materialId: v.pipe(
        v.nullable(v.number()),
        v.transform((input) => input ?? 0),
        v.minValue(1, "Vui lòng chọn vật tư"),
    ),
});
```

---

## 5. Services (hooks)

| Hook                                          | Pattern            | Endpoint                             | Ghi chú                           |
| --------------------------------------------- | ------------------ | ------------------------------------ | --------------------------------- |
| `useGetUnit(id)`                              | `useQuery`         | `GET /api/units/{id}/`               | Đã có ở `unit` feature            |
| `useAddConversion(unitId, conversionType)`    | `usePost`          | `POST /api/units/{id}/conversions/`  | Chọn schema theo `conversionType` |
| `useUpdateConversion(id, isReverse, initial)` | `usePartialUpdate` | `PATCH /api/unit-conversions/{id}/`  | Chỉ edit `factor`                 |
| `useDeleteConversion()`                       | `useMutation`      | `DELETE /api/unit-conversions/{id}/` | Đã có                             |

### `useAddConversion` — nhận thêm `conversionType`

```typescript
export function useAddConversion(
  unitId: number,
  conversionType: UnitConversionType,
  options?: ...,
) {
  const schema = conversionType === "material"
    ? MaterialConversionSchema
    : GlobalConversionSchema;

  return usePost({
    ...options,
    schema,
    initialInput: conversionType === "material"
      ? { toUnitId: null, factor: "1", materialId: null }
      : { toUnitId: null, factor: "1" },
    mutationFn: async (data) => {
      const response = await authApi.post<UnitConversion>(
        (ep) => ep.units.conversions(unitId),
        data,
      );
      return response.data;
    },
    // ... query invalidation giữ nguyên
  });
}
```

---

## 6. Config (không đổi)

```typescript
// endpoints.ts — authEndpoints
units: {
  // ... existing ...
  conversions: (id: number) => `/units/${id}/conversions/`,
},
unitConversions: {
  update: (id: number) => `/unit-conversions/${id}/`,
  delete: (id: number) => `/unit-conversions/${id}/`,
},

// querykeys.ts
export const unitConversionKeys = {
  all: ["unit-conversions"] as const,
  byUnit: (unitId: number) => [...unitConversionKeys.all, unitId] as const,
};
```

---

## 7. Quyết định thiết kế

| #   | Quyết định                                                     | Lý do                                                                        |
| --- | -------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| D1  | **`material` type là `SimpleMaterial \| null`**                | Tránh `any`, type-safe; backend trả nested `{id, code, name}` hoặc `null`    |
| D2  | **Tách `GlobalConversionSchema` / `MaterialConversionSchema`** | `materialId` bắt buộc khi material, cấm khi global → không thể dùng 1 schema |
| D3  | **`useAddConversion` nhận `conversionType`**                   | Dialog biết `unit.conversionType`, hook chọn schema + initialInput đúng      |
| D4  | **`materialId` chỉ trong POST, không trong PATCH**             | Backend §5.4: material không edit sau tạo                                    |
| D5  | **`factor` response là `string`**                              | Backend trả Decimal dạng string, frontend chỉ format hiển thị                |
| D6  | **`materialId` gửi dạng `number`**                             | SelectField transform string → number; null → 0 → validate minValue          |
| D7  | **`SimpleMaterial` đặt ở `features/material/types.ts`**        | Tuân theo convention `Simple*` (SimpleUnit, SimpleMaterialCategory)          |
