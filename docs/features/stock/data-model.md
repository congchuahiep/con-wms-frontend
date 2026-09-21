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

> `StockBalance` là **dữ liệu thô** theo cặp (warehouse, material). Trang Tồn kho
> không render trực tiếp mảng này mà gộp theo vật tư (xem `StockBalanceSummary`)
> — view chi tiết theo kho nằm ở trang warehouse detail.

### 1.4 `StockBalanceSummary` — view Tồn kho gộp theo vật tư (client-side)

Dựng từ `StockBalance[]` qua `aggregateStockBalances()` (`utils.ts`) — mỗi vật tư đúng **1 dòng**, tổng ở mọi kho. Từ **v1.6**, chi tiết **theo từng kho** đi kèm trong summary (phục vụ nút mở rộng trên trang Tồn kho):

```typescript
/** Tồn của 1 vật tư tại 1 kho — entry trong `StockBalanceSummary.warehouseBalances`.
 *  Giá trị tồn theo kho TÍNH từ giá nhập gần nhất của VẬT TƯ (summary.lastPurchasePrice),
 *  không lưu giá/giá trị theo kho (theo yêu cầu người dùng 2026-09-20). */
export type StockBalanceWarehouse = {
    warehouse: SimpleWarehouse;      // kho
    quantity: string;                // tồn tại kho này, Decimal(14,3), không dấu
};

export type StockBalanceSummary = {
    material: SimpleMaterial;
    unit: SimpleUnit;
    totalQuantity: string;               // tổng tồn mọi kho, Decimal(14,3)
    lastPurchasePrice: string | null;    // giá cao nhất trong các kho; null nếu chưa từng nhập mua
    totalStockValue: string | null;      // Σ (quantity × giá) mọi kho; null nếu mọi kho đều chưa có giá
    warehouseBalances: StockBalanceWarehouse[]; // v1.6: tồn theo từng kho (quantity ≠ 0) — thay cho `warehouses[]`
};
```

> `warehouseBalances` thay `warehouses` (D9): cột badge "Các kho có vật liệu này" derive từ `b.warehouse` — không lưu 2 nguồn sự thật.
> Không lưu `lastPurchasePrice`/`stockValue` theo kho — giá trị theo kho tính tại UI bằng giá nhập gần nhất của vật tư.

### 1.5 `StockMovement` — response `GET /api/stock/movements/` (dòng sổ kho)

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
| 9 | `sourceNote` | `SourceNoteRef \| null` | Phiếu nguồn — v1.7: thay `inboundNote`; `{ id, number, noteType }`. Luôn có giá trị (mọi dòng sinh từ phiếu); nullable để an toàn tương lai |
| 10 | `reversalOf` | `number \| null` | Trỏ về dòng gốc khi là dòng ngược dấu |
| 11 | `reason` | `string` | Lý do (hủy phiếu, chênh lệch kiểm kê); rỗng = `""` |
| 12 | `createdBy` | `SimpleUser` | Ai thực hiện (chốt/hủy phiếu) |
| 13 | `createdAt` | `string` | ISO datetime — thời điểm ghi sổ |

```typescript
/** Loại phiếu nguồn của dòng sổ kho — đồng bộ 3 nhóm trang `/notes/<type>`. */
export type SourceNoteType = "inbound" | "outbound" | "stocktake";

/** Phiếu nguồn sinh ra dòng sổ kho — `noteType` tự mô tả loại phiếu. */
export type SourceNoteRef = {
    id: number;
    number: string; // "PN-...", "PX-...", "PK-..."
    noteType: SourceNoteType;
};

export type StockMovement = {
    id: number;
    movementType: MovementType;
    movementTypeLabel: string;
    date: string;
    material: SimpleMaterial;
    warehouse: SimpleWarehouse;
    quantity: string;
    unitPrice: string | null;
    sourceNote: SourceNoteRef | null; // v1.7: thay inboundNote
    reversalOf: number | null;
    reason: string;
    createdBy: SimpleUser;
    createdAt: string;
};
```

> `sourceNote.noteType` do backend suy từ FK nguồn thực tế (không phải map ngược từ
> `movementType`): dòng nhập do điều chuyển (`inbound_transfer_from_warehouse`) trỏ về
> **CÙNG phiếu xuất điều chuyển** nên `noteType = "outbound"`; dòng reversal (`reversalOf != null`)
> giữ nguyên phiếu nguồn của dòng gốc (phiếu đã hủy).

### 1.6 Query params

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
| `StockBalance` | — | — | Không phải bảng — là kết quả aggregate theo `(warehouse, material)` — **dữ liệu thô** cho `StockBalanceSummary` |
| `StockBalanceSummary` | — | — | View gộp theo vật tư (client-side) — dữ liệu hiển thị trang Tồn kho |
| `StockMovement` → `SimpleMaterial` | N → 1 | 1 dòng sổ kho là 1 vật tư |
| `StockMovement` → `SimpleWarehouse` | N → 1 | 1 dòng thuộc 1 kho |
| `StockMovement` → `sourceNote` | N → 1 | Phiếu nguồn — phiếu nhập/xuất/kiểm kê tùy loại dòng (v1.7: thay `inboundNote`) |

## 4. Quyết định thiết kế

| # | Quyết định | Lý do |
|---|---|---|
| D1 | **Không có `schemas.ts`** | Feature read-only — backend không có endpoint write (stock D9). Không form, không mutation. |
| D2 | **Decimal luôn là `string`** | Backend `DecimalField` serialize thành string (`"85.000"`). Parse sang number mất độ chính xác và mất chữ số thập phân hiển thị. So sánh/nhân khi cần dùng `Number()` tạm thời hoặc thư viện decimal. |
| D3 | **Simple types đặt ở feature sở hữu, đặt tên `Simple*`** | Quy chuẩn dự án (`SimpleMaterialCategory`, `SimpleUnit`). `SimpleUnit` có sẵn → reuse; thêm `SimpleMaterial` (material), `SimpleWarehouse` (warehouse), `SimpleUser` (auth). Consumer import type-only, không cycle. |
| D4 | **Dấu của `quantity` do dữ liệu quyết định** | `stocktake_adjustment` có thể + hoặc −, `reversal` ngược dấu dòng gốc → không suy dấu từ `movementType`. Helper `formatSignedQuantity()` trong `utils.ts` dựa vào `Number(quantity)`. |
| D5 | **`sourceNote` nullable trong type** | V1.7: thay `inboundNote`. Mọi dòng hiện tại đều có phiếu nguồn, nhưng type nullable để an toàn tương lai (dòng điều chỉnh không thuộc phiếu nào — backend api.md v1.6). |
| D6 | **2 query keys trong 1 `stockKeys`** | `stockKeys.all = ["stock"]` bao trùm cả `balances` và `movements` → inbound-note chốt/hủy phiếu chỉ cần invalidate 1 prefix. |
| D7 | **Có `utils.ts`** | Color map badge cho 6 loại dòng + `formatSignedQuantity()` là runtime code dùng chung cho cả 2 trang (tồn kho + sổ kho). |
| D8 | **Gộp theo vật tư ở client (`aggregateStockBalances`)** | Backend chi trả theo (warehouse, material), không có endpoint tổng. Mảng phẳng vài trăm dòng → gộp client-side đủ nhẹ. Cộng decimal bằng số nguyên mở rộng (không `Number` +/+) để giữ nguyên quy tắc D2. |
| D9 | **`warehouseBalances[]` thay `warehouses[]`** | Nút mở rộng trên trang Tồn kho cần **số lượng theo từng kho**, không chỉ tên kho. `warehouseBalances` chứa đủ (`warehouse` + `quantity`); cột badge cũ derive `warehouse` — tránh 2 field lưu trùng. Chỉ giữ kho có quantity ≠ 0, giữ thứ tự xuất hiện (như `warehouses` cũ). |
| D10 | **Không lưu giá/giá trị theo kho** | Theo yêu cầu người dùng (2026-09-20): bảng con không hiện giá nhập theo kho — giá trị tồn theo kho **luôn tính bằng giá nhập gần nhất của vật tư** (`summary.lastPurchasePrice`) tại UI. Giữ `StockBalanceWarehouse` tối giản (`warehouse` + `quantity`). |

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
