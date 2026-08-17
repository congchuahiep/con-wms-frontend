# API Spec — Stock (Tồn kho & Sổ kho)

> **Status:** 🔵 Đang thiết kế.
> Nguồn: backend [`api.md`](../../../con-wms/docs/entities/stock/api.md)

## Endpoints

| Method | Endpoint | Mô tả | Permission | Pagination | Status |
|---|---|---|---|---|---|
| `GET` | `/api/stock/` | Tồn kho hiện tại theo kho + vật tư | `IsAuthenticated` | **Không** — mảng phẳng | 🔵 |
| `GET` | `/api/stock/movements/` | Sổ kho — lịch sử dòng ghi | `IsAuthenticated` | Có — `page_size=50`, sort `-date, -id` | 🔵 |

> **Không có endpoint write** — POST/PUT/DELETE → `405` (stock D9). Thay đổi tồn chỉ qua chốt/hủy phiếu ở feature `inbound-note`.

## 1. `GET /api/stock/` — Tồn kho hiện tại

**Query params** (đều optional):

| Param | Type | Mô tả |
|---|---|---|
| `warehouse` | `number` | Lọc theo kho |
| `material` | `number` | Lọc theo vật tư |
| `category` | `number` | Lọc theo nhóm vật tư |
| `search` | `string` | Tìm theo mã/tên vật tư |
| `hasStock` | `boolean` | Chỉ lấy vật tư còn tồn (`quantity ≠ 0`) |

> Backend đã normalize camelCase cho query params (xác nhận 2026-08-13).

**Response `200`** — mảng phẳng:

```json
[
  {
    "material": { "id": 1, "code": "XM_PCB40", "name": "Xi măng PCB40" },
    "unit": { "id": 2, "code": "BAO", "name": "Bao" },
    "warehouse": { "id": 1, "code": "KHO_CHINH", "name": "Kho chính — Bãi sau" },
    "quantity": "85.000",
    "lastPurchasePrice": "88000.00",
    "stockValue": "7480000.00"
  }
]
```

## 2. `GET /api/stock/movements/` — Sổ kho

**Query params:**

| Param | Type | Mô tả |
|---|---|---|
| `material` | `number` | Lọc theo vật tư |
| `warehouse` | `number` | Lọc theo kho |
| `movementType` | `MovementType` | Lọc theo loại dòng |
| `dateFrom` / `dateTo` | `string` (`YYYY-MM-DD`) | Lọc theo **ngày nghiệp vụ** |
| `inboundNote` | `number` | Xem sổ kho của 1 phiếu |
| `originalsOnly` | `boolean` | Ẩn dòng reversal — **mặc định `true`** |
| `page` / `pageSize` | `number` | Phân trang — backend mặc định `page_size=50` |

**Response `200`** — shape `Paginated<T>` (`{items, meta}`):

```json
{
  "items": [
    {
      "id": 12,
      "movementType": "inbound_purchase_from_supplier",
      "movementTypeLabel": "Nhập kho: mua hàng từ nhà cung cấp",
      "date": "2026-08-13",
      "material": { "id": 1, "code": "XM_PCB40", "name": "Xi măng PCB40" },
      "warehouse": { "id": 1, "code": "KHO_CHINH", "name": "Kho chính — Bãi sau" },
      "quantity": "100.000",
      "unitPrice": "88000.00",
      "inboundNote": { "id": 3, "number": "PN-20260813-001" },
      "reversalOf": null,
      "reason": "",
      "createdBy": { "id": 2, "email": "thukho@test.com" },
      "createdAt": "2026-08-13T08:30:00+07:00"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 50,
    "total": 128,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## 3. Error responses

| Status | Mô tả |
|---|---|
| 401 | Chưa đăng nhập |
| 405 | Mọi method khác `GET` trên 2 endpoint (read-only) |

## 4. Shape phân trang — ✅ Đã xác nhận

- Backend trả về custom pagination **`{items, meta}`** — khớp type `Paginated<T>` trong `src/types.ts` (giống `materials`).
- Doc backend ghi `{count, results}` là ghi lộn — backend đã cập nhật doc.
- `/api/stock/movements/`: `pageSize` mặc định 50, sắp xếp `-date, -id`. `/api/stock/` không phân trang.

## Open questions — ✅ Đã giải quyết (2026-08-13)

| # | Câu hỏi | Kết luận |
|---|---|---|
| OQ-1 | Shape phân trang | `{items, meta}` — dùng `Paginated<T>` |
| OQ-2 | Case query params | camelCase — backend đã normalize |
| OQ-3 | Nút "hiện dòng reversal" | UI concern — chuyển sang skill `page-design` |
