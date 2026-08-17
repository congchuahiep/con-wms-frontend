# Data Model — Stock (Tồn kho & Sổ kho)

> **v0.2** — Theo phản hồi duyệt thiết kế (2026-08-13)
> Nguồn: backend [`model.md`](../../../con-wms/docs/entities/stock/model.md) + [`api.md`](../../../con-wms/docs/entities/stock/api.md)

## 1. Types

### 1.1 Simple types (nested object rút gọn)

Backend trả về FK dưới dạng nested object rút gọn. Quy chuẩn dự án: đặt tên `Simple*` và **định nghĩa ở feature sở hữu** (giống `SimpleMaterialCategory` trong `material-category/types.ts`), consumer import type-only:

```typescript
// Có sẵn — reuse trực tiếp
import type { SimpleUnit } from "@/features/unit";

// Thêm mới vào feature sở hữu (xem implementation.md):
// src/features/material/types.ts
export type SimpleMaterial = { id: number; code: string; name: string };

// src/features/warehouse/types.ts
export type SimpleWarehouse = { id: number; code: string; name: string };

// src/features/auth/types.ts — backend chỉ trả {id, email} cho created_by/voided_by
export type SimpleUser = { id: number; email: string };
```

### 1.2 `MovementType` — union (backend `TextChoices`, 6 giá trị)

```typescript
export type MovementType =
    | "inbound_purchase_from_supplier"
    | "inbound_return_from_site"
    | "outbound_issue_for_use"
    | "outbound_transfer_to_warehouse"
    | "inbound_transfer_from_warehouse"
    | "stocktake_adjustment";
```

> `movementTypeLabel` (vd: "Nhập kho: mua hàng từ nhà cung cấp") do backend trả sẵn (`get_movement_type_display()`) — client không cần tự map label, chỉ cần màu badge (xem `utils.ts`).

### 1.3 `StockBalance` — response `GET /api/stock/` (tồn kho hiện tại)

| # | Field | Type | Ghi chú |
|---|---|---|---|
| 1 | `material` | `SimpleMaterial` | Vật tư |
| 2 | `unit` | `SimpleUnit` | Đơn vị cơ bản của vật tư |
| 3 | `warehouse` | `SimpleWarehouse` | Kho |
| 4 | `quantity` | `string` | Decimal(14,3), tồn hiện tại (không dấu) — `"85.000"` |
| 5 | `lastPurchasePrice` | `string \| null` | Decimal(14,2) — `unit_price` dòng `inbound_purchase_from_supplier` mới nhất; null nếu chưa từng nhập mua |
| 6 | `stockValue` | `string \| null` | `quantity × lastPurchasePrice`; null nếu giá null |

```typescript
export type StockBalance = {
    material: SimpleMaterial;
    unit: SimpleUnit;
    warehouse: SimpleWarehouse;
    quantity: string;
    lastPurchasePrice: string | null;
    stockValue: string | null;
};
```

### 1.4 `StockMovement` — response `GET /api/stock/movements/` (dòng sổ kho)

| # | Field | Type | Ghi chú |
|---|---|---|---|
| 1 | `id` | `number` | PK |
| 2 | `movementType` | `MovementType` | Loại dòng |
| 3 | `movementTypeLabel` | `string` | Label tiếng Việt từ backend |
| 4 | `date` | `string` | Ngày nghiệp vụ `"YYYY-MM-DD"` (copy từ phiếu) |
| 5 | `material` | `SimpleMaterial` | Vật tư |
| 6 | `warehouse` | `SimpleWarehouse` | Kho |
| 7 | `quantity` | `string` | **Có dấu**: nhập `"100.000"`, xuất `"-100.000"` |
| 8 | `unitPrice` | `string \| null` | Chỉ có khi `movementType = "inbound_purchase_from_supplier"` |
| 9 | `inboundNote` | `{ id: number; number: string } \| null` | Phiếu nguồn. Phase 1: luôn có; nullable để tương lai outbound/stocktake |
| 10 | `reversalOf` | `number \| null` | Trỏ về dòng gốc khi là dòng ngược dấu |
| 11 | `reason` | `string` | Lý do (hủy phiếu, chênh lệch kiểm kê); rỗng = `""` |
| 12 | `createdBy` | `SimpleUser` | Ai thực hiện (chốt/hủy phiếu) |
| 13 | `createdAt` | `string` | ISO datetime — thời điểm ghi sổ |

```typescript
export type StockMovement = {
    id: number;
    movementType: MovementType;
    movementTypeLabel: string;
    date: string;
    material: SimpleMaterial;
    warehouse: SimpleWarehouse;
    quantity: string;
    unitPrice: string | null;
    inboundNote: { id: number; number: string } | null;
    reversalOf: number | null;
    reason: string;
    createdBy: SimpleUser;
    createdAt: string;
};
```

### 1.5 Query params

```typescript
export type GetStockParams = {
    warehouse?: number;      // ?warehouse=1
    material?: number;       // ?material=1
    category?: number;       // ?category=1
    search?: string;         // ?search=XM — tìm theo mã/tên vật tư
    hasStock?: boolean;      // ?hasStock=true — chỉ vật tư còn tồn
};

export type GetStockMovementsParams = {
    material?: number;
    warehouse?: number;
    movementType?: MovementType;
    dateFrom?: string;       // "2026-08-01"
    dateTo?: string;         // "2026-08-31"
    inboundNote?: number;
    originalsOnly?: boolean; // mặc định backend true — ẩn dòng reversal
    page?: number;
    pageSize?: number;       // backend mặc định 50
};
```

> **camelCase** — backend đã normalize camelCase cho query params (xác nhận 2026-08-13). Khớp convention `page`/`pageSize` của `material/services.ts`.

## 2. Enums / Union Types

| Union | Giá trị | Ghi chú |
|---|---|---|
| `MovementType` | 6 giá trị ở §1.2 | Backend `TextChoices`; client chỉ cần union type + color map |

## 3. Quan hệ

| Type A | Cardinality | Type B | Mô tả |
|---|---|---|---|
| `StockBalance` | — | — | Không phải bảng — là kết quả aggregate theo `(warehouse, material)` |
| `StockMovement` → `SimpleMaterial` | N → 1 | 1 dòng sổ kho là 1 vật tư |
| `StockMovement` → `SimpleWarehouse` | N → 1 | 1 dòng thuộc 1 kho |
| `StockMovement` → `inboundNote` | N → 1 | Nguồn phiếu (phase 1) |

## 4. Quyết định thiết kế

| # | Quyết định | Lý do |
|---|---|---|
| D1 | **Không có `schemas.ts`** | Feature read-only — backend không có endpoint write (stock D9). Không form, không mutation. |
| D2 | **Decimal luôn là `string`** | Backend `DecimalField` serialize thành string (`"85.000"`). Parse sang number mất độ chính xác và mất chữ số thập phân hiển thị. So sánh/nhân khi cần dùng `Number()` tạm thời hoặc thư viện decimal. |
| D3 | **Simple types đặt ở feature sở hữu, đặt tên `Simple*`** | Quy chuẩn dự án (`SimpleMaterialCategory`, `SimpleUnit`). `SimpleUnit` có sẵn → reuse; thêm `SimpleMaterial` (material), `SimpleWarehouse` (warehouse), `SimpleUser` (auth). Consumer import type-only, không cycle. |
| D4 | **Dấu của `quantity` do dữ liệu quyết định** | `stocktake_adjustment` có thể + hoặc −, `reversal` ngược dấu dòng gốc → không suy dấu từ `movementType`. Helper `formatSignedQuantity()` trong `utils.ts` dựa vào `Number(quantity)`. |
| D5 | **`inboundNote` nullable trong type** | Phase 1 thực tế luôn có giá trị, nhưng type nullable để khớp hình dạng đích khi có outbound/stocktake (backend model.md D7). |
| D6 | **2 query keys trong 1 `stockKeys`** | `stockKeys.all = ["stock"]` bao trùm cả `balances` và `movements` → inbound-note chốt/hủy phiếu chỉ cần invalidate 1 prefix. |
| D7 | **Có `utils.ts`** | Color map badge cho 6 loại dòng + `formatSignedQuantity()` là runtime code dùng chung cho cả 2 trang (tồn kho + sổ kho). |

## 5. `utils.ts` (runtime)

```typescript
import type { MovementType } from "./types";

export const MOVEMENT_TYPE_COLOR_MAP: Record<MovementType, string> = {
    inbound_purchase_from_supplier: "bg-green-100 text-green-700 border-green-300",
    inbound_return_from_site: "bg-teal-100 text-teal-700 border-teal-300",
    outbound_issue_for_use: "bg-red-100 text-red-700 border-red-300",
    outbound_transfer_to_warehouse: "bg-orange-100 text-orange-700 border-orange-300",
    inbound_transfer_from_warehouse: "bg-blue-100 text-blue-700 border-blue-300",
    stocktake_adjustment: "bg-purple-100 text-purple-700 border-purple-300",
};

export function getMovementTypeColorClass(type: MovementType): string {
    return MOVEMENT_TYPE_COLOR_MAP[type] ?? "bg-muted text-muted-foreground border-border";
}

/** "100.000" → "+100.000", "-5.500" → "-5.500" (số 0 → "0.000") */
export function formatSignedQuantity(quantity: string): string {
    const value = Number(quantity);
    if (value > 0) return `+${quantity}`;
    return quantity;
}
```
