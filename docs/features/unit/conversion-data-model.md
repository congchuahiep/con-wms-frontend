# UnitConversion — Data Model & API Spec

> **v1.1** — Chỉ quy đổi toàn cục (material-specific = backlog)

## 1. Types

### `UnitConversion` — Response từ API

| # | Field | Type | Required | Ghi chú |
|---|---|---|---|---|
| 1 | `id` | `number` | ✅ | Primary key |
| 2 | `toUnit` | `SimpleUnit` | ✅ | Đơn vị đích |
| 3 | `factor` | `string` | ✅ | Hệ số quy đổi (Decimal, dạng string) |

```typescript
export type SimpleUnit = {
  id: number;
  code: string;
  name: string;
};

export type UnitConversion = {
  id: number;
  toUnit: SimpleUnit;
  factor: string;
};
```

### `DetailedUnit` — Response từ `GET /api/units/{id}/conversions/`

```typescript
export type DetailedUnit = Unit & {
  conversions: UnitConversion[];        // Quy đổi theo vật tư (material != null) — BACKLOG
  globalConversions: UnitConversion[];  // Quy đổi toàn cục (material == null) — DÙNG NGAY
};
```

### Request types

**POST** `/api/units/{id}/conversions/`:

| # | Field | Type | Required | Ghi chú |
|---|---|---|---|---|
| 1 | `toUnitId` | `number` | ✅ | ID đơn vị đích |
| 2 | `factor` | `number` | ✅ | Hệ số (gửi number, backend lưu Decimal) |

**PATCH** `/api/unit-conversions/{id}/`:

| # | Field | Type | Required | Ghi chú |
|---|---|---|---|---|
| 1 | `factor` | `number` | — | Chỉ gửi field thay đổi (partial) |

---

## 2. API Endpoints

| Method | Endpoint | Mô tả | Permission |
|---|---|---|---|
| `GET` | `/api/units/{id}/conversions/` | Chi tiết unit + danh sách quy đổi | IsAuthenticated |
| `POST` | `/api/units/{id}/conversions/` | Tạo quy đổi mới (toàn cục) | IsAdminOrStorekeeper |
| `PATCH` | `/api/unit-conversions/{id}/` | Cập nhật quy đổi (endpoint phẳng) | IsAdminOrStorekeeper |
| `DELETE` | `/api/unit-conversions/{id}/` | Xoá quy đổi (endpoint phẳng) | IsAdminOrStorekeeper |

> **Tại sao PATCH/DELETE dùng endpoint phẳng?** GET list + POST create được gom dưới Unit vì `from_unit` đã biết từ URL. PATCH/DELETE thao tác trên 1 conversion cụ thể, không cần biết `from_unit` → dùng endpoint phẳng cho gọn.

---

## 3. Schema Validation

### `ConversionSchema` — cho POST create (chỉ toàn cục)

```typescript
export const ConversionSchema = v.object({
  toUnitId: v.pipe(
    v.number("Đơn vị đích không hợp lệ"),
    v.minValue(1, "Vui lòng chọn đơn vị đích"),
  ),
  factor: v.pipe(
    v.number("Hệ số phải là số"),
    v.minValue(0.0001, "Hệ số phải lớn hơn 0"),
  ),
});
```

---

## 4. Services (hooks cần tạo)

| Hook | Pattern | Endpoint |
|---|---|---|
| `useGetUnitConversions(unitId)` | `useQuery` | `GET /api/units/{id}/conversions/` |
| `useAddConversion(unitId)` | `usePost` | `POST /api/units/{id}/conversions/` |
| `useUpdateConversion(id, initial)` | `usePartialUpdate` | `PATCH /api/unit-conversions/{id}/` |
| `useDeleteConversion()` | `useMutation` | `DELETE /api/unit-conversions/{id}/` |

---

## 5. Config

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

## 6. Quyết định thiết kế

| # | Quyết định | Lý do |
|---|---|---|
| D1 | **Chỉ làm quy đổi toàn cục** | Material feature chưa có → quy đổi theo vật tư backlog |
| D2 | **Không có `materialId` trong form** | Tạm thời mọi POST đều là toàn cục |
| D3 | **`factor` type là `string` trong response** | Backend trả Decimal dạng string (`"1000.0000"`) |
| D4 | **Form gửi `factor` dạng number** | InputField type="number", backend nhận number → Decimal |
| D5 | **Query key theo `unitId`** | Mỗi unit có danh sách conversion riêng |
| D6 | **Dùng `usePartialUpdate` cho edit** | Chỉ gửi factor thay đổi |
