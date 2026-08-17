# Data Model — Inbound Note (Phiếu Nhập)

> **v0.2** — Theo phản hồi duyệt thiết kế (2026-08-13)
> Nguồn: backend [`model.md`](../../../con-wms/docs/entities/inbound-note/model.md) + [`api.md`](../../../con-wms/docs/entities/inbound-note/api.md)

## 1. Types

### 1.1 Simple types (dùng lại từ feature sở hữu)

Import type-only từ feature sở hữu (quy chuẩn `Simple*`, giống `SimpleMaterialCategory`):

```typescript
import type { SimpleUser } from "@/features/auth";
import type { SimpleMaterial } from "@/features/material";
import type { SimpleWarehouse } from "@/features/warehouse";

/** Thêm mới vào feature sở hữu (xem implementation.md) — backend trả supplier dạng {id, code, name} */
// src/features/supplier/types.ts
export type SimpleSupplier = { id: number; code: string; name: string };
```

> Không có cycle: tất cả đều là import type-only. Chiều ngược lại, `inbound-note/services.ts` invalidate `stockKeys` — chỉ import từ `@/configs/querykeys` (config chung), không import gì từ `src/features/stock/`.

### 1.2 Enums (union)

```typescript
export type InboundNoteType = "purchase" | "return_from_site";
export type InboundNoteStatus = "draft" | "posted" | "voided";
```

> `noteTypeLabel` / `statusLabel` do backend trả sẵn (`get_*_display()`) — client chỉ cần màu badge (xem `utils.ts`).

### 1.3 `InboundNote` — item danh sách (không kèm lines)

| #   | Field           | Type                  | Ghi chú                                                |
| --- | --------------- | --------------------- | ------------------------------------------------------ |
| 1   | `id`            | `number`              | PK                                                     |
| 2   | `number`        | `string`              | Số phiếu `PN-YYYYMMDD-NNN` — server tự sinh, read-only |
| 3   | `noteType`      | `InboundNoteType`     | Loại phiếu                                             |
| 4   | `noteTypeLabel` | `string`              | "Nhập mua" / "Nhập hàng công trường trả lại"          |
| 5   | `status`        | `InboundNoteStatus`   | Vòng đời phiếu                                         |
| 6   | `statusLabel`   | `string`              | "Nháp" / "Đã chốt" / "Đã hủy"                          |
| 7   | `date`          | `string`              | Ngày nhập `"YYYY-MM-DD"`                               |
| 8   | `warehouse`     | `SimpleWarehouse`        | Kho nhận hàng                                          |
| 9   | `supplier`      | `SimpleSupplier \| null` | NCC — null khi `return_from_site` (D3)                  |
| 10  | `createdBy`     | `SimpleUser`             | Người lập — server tự set, read-only                   |
| 11  | `totalAmount`   | `string`              | Σ(quantity × unitPrice) — tính động, không lưu DB      |
| 12  | `totalQuantity` | `string`              | Σ quantity                                             |
| 13  | `note`          | `string`              | Ghi chú phiếu                                          |
| 14  | `voidedBy`      | `SimpleUser \| null`     | Ai hủy                                                 |
| 15  | `voidedAt`      | `string \| null`      | ISO datetime khi hủy                                   |
| 16  | `voidReason`    | `string`              | Lý do hủy                                              |
| 17  | `createdAt`     | `string`              | ISO datetime                                           |
| 18  | `updatedAt`     | `string`              | ISO datetime                                           |

```typescript
export type InboundNote = {
    id: number;
    number: string;
    noteType: InboundNoteType;
    noteTypeLabel: string;
    status: InboundNoteStatus;
    statusLabel: string;
    date: string;
    warehouse: SimpleWarehouse;
    supplier: SimpleSupplier | null;
    createdBy: SimpleUser;
    totalAmount: string;
    totalQuantity: string;
    note: string;
    voidedBy: SimpleUser | null;
    voidedAt: string | null;
    voidReason: string;
    createdAt: string;
    updatedAt: string;
};
```

### 1.4 `InboundNoteLine` + `InboundNoteDetail`

```typescript
export type InboundNoteLine = {
    id: number;
    material: SimpleMaterial;
    quantity: string; // Decimal(14,3) — "100.000"
    unitPrice: string; // Decimal(14,2) — "88000.00"
    lineNo: number; // thứ tự dòng thủ kho quét (D7)
    note: string;
};

/** Response GET /api/inbound-notes/{id}/ — list gọn không kèm lines, chi tiết mới có */
export type InboundNoteDetail = InboundNote & {
    lines: InboundNoteLine[];
};
```

### 1.5 Input types (client gửi lên)

```typescript
export type InboundNoteLineInput = {
    materialId: number;
    quantity: string; // gửi string decimal — khớp backend nhận "100", "5.5"
    unitPrice: string;
    note: string;
};

export type InboundNoteInput = {
    noteType: InboundNoteType;
    date: string;
    warehouseId: number;
    supplierId: number | null; // bắt buộc khi purchase, null khi return (D3)
    note: string;
    lines: InboundNoteLineInput[];
};
```

### 1.6 Query params

```typescript
export type GetInboundNotesParams = {
    noteType?: InboundNoteType;
    status?: InboundNoteStatus;
    warehouse?: number;
    supplier?: number;
    dateFrom?: string; // "2026-08-01"
    dateTo?: string; // "2026-08-31"
    search?: string; // tìm theo số phiếu
    page?: number;
    pageSize?: number; // backend mặc định 20 (D8)
};
```

> **camelCase** — backend đã normalize camelCase cho query params (xác nhận 2026-08-13).

## 2. Schemas (Valibot)

> `import * as v from "valibot"` — KHÔNG `import type` (cần runtime).

```typescript
export const InboundNoteLineSchema = v.object({
    materialId: v.pipe(
        v.nullable(v.number()),
        v.transform((input) => input ?? 0),
        v.minValue(1, "Vui lòng chọn vật tư"),
    ),
    quantity: v.pipe(
        v.string("Số lượng phải là chuỗi"),
        v.nonEmpty("Số lượng không được để trống"),
        v.decimal("Số lượng phải là số"),
        v.check((input) => Number(input) > 0, "Số lượng phải lớn hơn 0"),
    ),
    unitPrice: v.pipe(
        v.string("Đơn giá phải là chuỗi"),
        v.nonEmpty("Đơn giá không được để trống"),
        v.decimal("Đơn giá phải là số"),
        v.check((input) => Number(input) >= 0, "Đơn giá không được âm"),
    ),
    note: v.optional(v.string(), ""),
});

// Dùng v.pipe(v.object(...), v.check(...)) vì valibot v1 KHÔNG nhận pipeline array ở arg 2 của v.object
export const InboundNoteSchema = v.pipe(
    v.object({
        noteType: v.picklist(["purchase", "return_from_site"], "Loại phiếu không hợp lệ"),
        date: v.pipe(
            v.string("Ngày nhập phải là chuỗi"),
            v.nonEmpty("Ngày nhập không được để trống"),
            v.isoDate("Ngày nhập không đúng định dạng YYYY-MM-DD"),
        ),
        warehouseId: v.pipe(
            v.nullable(v.number()),
            v.transform((input) => input ?? 0),
            v.minValue(1, "Vui lòng chọn kho"),
        ),
        supplierId: v.nullable(v.number()),
        note: v.optional(v.string(), ""),
        lines: v.pipe(
            v.array(InboundNoteLineSchema),
            v.minLength(1, "Phiếu phải có ít nhất 1 dòng"),
        ),
    }),
    // D3 backend: purchase → bắt buộc supplier; return_from_site → bắt buộc null
    v.check(
        (input) =>
            input.noteType !== "purchase" || input.supplierId != null,
        "Phiếu nhập mua phải chọn nhà cung cấp",
    ),
    v.check(
        (input) =>
            input.noteType !== "return_from_site" ||
            input.supplierId == null,
        "Phiếu nhập hàng công trường trả lại không có nhà cung cấp",
    ),
);

/** Body POST /{id}/void/ — bắt buộc lý do (D12) */
export const VoidNoteSchema = v.object({
    reason: v.pipe(
        v.string("Lý do hủy phải là chuỗi"),
        v.nonEmpty("Lý do hủy không được để trống"),
        v.maxLength(1000, "Lý do hủy tối đa 1000 ký tự"),
    ),
});
```

## 3. Quan hệ

| Type A                                    | Cardinality | Type B                                            | Mô tả |
| ----------------------------------------- | ----------- | ------------------------------------------------- | ----- |
| `InboundNote` → `SimpleWarehouse`            | N → 1       | Phiếu thuộc 1 kho                                 |
| `InboundNote` → `SimpleSupplier`             | N → 1       | Nhập mua từ NCC (null khi nhập hàng công trường trả lại)               |
| `InboundNoteDetail.lines` → `SimpleMaterial` | 1 → N       | Dòng phiếu là 1 vật tư                            |
| `InboundNote` → `StockMovement`           | 1 → N       | Chốt/hủy phiếu sinh dòng sổ kho (feature `stock`) |

## 4. Quyết định thiết kế

| #   | Quyết định                                                                       | Lý do                                                                                                                                                                                                   |
| --- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **`quantity`/`unitPrice` input là `string`**                                     | Backend nhận string decimal (vd `"5.5"`, `"88000"`). Form dùng text input, validate bằng `v.decimal()` + `v.check()` — khớp mẫu `factor` của `material/schemas.ts`.                                     |
| D2  | **Supplier điều kiện dùng `v.check` trên object, không dùng `v.union` 2 schema** | 1 schema duy nhất đơn giản cho Formisch (initialInput, reset). `v.check` xử lý đủ 2 rule D3 (purchase bắt buộc / return cấm). Lưu ý: valibot v1 yêu cầu bọc `v.pipe(v.object(...), v.check(...))` — arg 2 của `v.object` không nhận pipeline array. |
| D3  | **PUT replace-all KHÔNG dùng `usePartialUpdate`**                                | `usePartialUpdate` dirty-tracking chỉ gửi field thay đổi → user không đụng `lines` thì `lines` bị bỏ qua → backend replace-all xóa sạch dòng. Lệch convention PATCH có chủ đích (xem `services.ts` §5). |
| D4  | **Chốt/hủy dùng `useMutation` riêng, hủy dùng `usePost` + `VoidNoteSchema`**     | Chốt không cần body → `useMutation` gọn (`useFinalizeInboundNote` — tên hook tránh nhầm với `usePost`). Hủy cần form lý do → `usePost` cho form + map lỗi `reason` tự động. |
| D5  | **Mọi mutation invalidate cả `inboundNoteKeys` + `stockKeys`**                   | Chốt/hủy ghi sổ kho → tồn kho + sổ kho thay đổi ngay. Invalidate prefix `["stock"]` (bao trùm balances + movements) + `["inbound-notes"]`.                                                              |
| D6  | **`VoidNoteSchema` tách riêng, không nhét `reason` vào `InboundNoteSchema`**     | `reason` chỉ có ở action void — nhét chung làm form tạo phiếu dính field thừa.                                                                                                                          |
| D7  | **Date validate bằng `v.isoDate()`**                                             | Chấp nhận date-only `"YYYY-MM-DD"` — xác nhận khi code (nếu strict quá thì fallback `v.regex(/^\d{4}-\d{2}-\d{2}$/)`).                                                                                  |
| D8  | **Có `utils.ts`**                                                                | Color map badge cho `InboundNoteStatus` + helper `getTodayDateString()` cho initialInput của form.                                                                                                      |
| D9  | **Simple types ở feature sở hữu (`Simple*`)**                                   | Quy chuẩn dự án (`SimpleMaterialCategory`, `SimpleUnit`). Thêm `SimpleSupplier` vào `supplier/types.ts`; reuse `SimpleMaterial`/`SimpleWarehouse`/`SimpleUser` từ feature chủ — import type-only, không cycle. |
| D10 | **POST/PUT trả về `InboundNoteDetail` (kèm lines)**                              | Backend xác nhận response tạo/sửa phiếu kèm `lines` (OQ-4) — không cần fetch lại detail sau khi tạo/sửa. |
| D11 | **`noteType` dùng `v.picklist`, không `v.union`**                                | `v.union` khiến Formisch khởi tạo field store kiểu union (phức tạp cho select); `picklist` là value field thường — an toàn cho dropdown. |
| D12 | **`warehouseId`/`materialId` nullable + transform → 0 + minValue(1)**            | Khớp pattern `categoryId`/`toUnitId` của `material/schemas.ts` — select có thể bắt đầu trống, submit mới báo lỗi. |

## 5. `utils.ts` (runtime)

```typescript
import type {
    InboundNoteDetail,
    InboundNoteInput,
    InboundNoteStatus,
} from "./types";

export const NOTE_STATUS_COLOR_MAP: Record<InboundNoteStatus, string> = {
    draft: "bg-muted text-muted-foreground border-border",
    posted: "bg-green-100 text-green-700 border-green-300",
    voided: "bg-red-100 text-red-700 border-red-300",
};

export function getNoteStatusColorClass(status: InboundNoteStatus): string {
    return (
        NOTE_STATUS_COLOR_MAP[status] ??
        "bg-muted text-muted-foreground border-border"
    );
}

/** Ngày hôm nay dạng "YYYY-MM-DD" — initialInput cho field date */
export function getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10);
}

/** Chuyển detail (response) → input form sửa phiếu — map nested object sang id */
export function toInboundNoteInput(detail: InboundNoteDetail): InboundNoteInput {
    return {
        noteType: detail.noteType,
        date: detail.date,
        warehouseId: detail.warehouse.id,
        supplierId: detail.supplier?.id ?? null,
        note: detail.note,
        lines: detail.lines.map((line) => ({
            materialId: line.material.id,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            note: line.note,
        })),
    };
}
```
