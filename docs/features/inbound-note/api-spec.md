# API Spec — Inbound Note (Phiếu Nhập)

> **Status:** 🔵 Đang thiết kế.
> Nguồn: backend [`api.md`](../../../con-wms/docs/entities/inbound-note/api.md) + [`auth.md`](../../../con-wms/docs/entities/inbound-note/auth.md)

## Endpoints

| Method | Endpoint | Mô tả | Permission | Status |
|---|---|---|---|---|
| `GET` | `/api/inbound-notes/` | Danh sách phiếu (paginated, không kèm lines) | `IsAuthenticated` | 🔵 |
| `POST` | `/api/inbound-notes/` | Tạo phiếu **nháp** + dòng (nested write) | `IsAdminOrStorekeeper` | 🔵 |
| `GET` | `/api/inbound-notes/{id}/` | Chi tiết phiếu + lines | `IsAuthenticated` | 🔵 |
| `PUT` | `/api/inbound-notes/{id}/` | Sửa phiếu **nháp** (replace-all) | `IsAdminOrStorekeeper` | 🔵 |
| `DELETE` | `/api/inbound-notes/{id}/` | Xóa cứng phiếu **nháp** | `IsAdminOrStorekeeper` | 🔵 |
| `POST` | `/api/inbound-notes/{id}/post/` | **Chốt phiếu** → ghi sổ kho | `IsAdminOrStorekeeper` | 🔵 |
| `POST` | `/api/inbound-notes/{id}/void/` | **Hủy phiếu** → dòng sổ kho ngược dấu | `IsAdminOrStorekeeper` | 🔵 |

## 1. `GET /api/inbound-notes/` — danh sách

**Query params:**

| Param | Type | Mô tả |
|---|---|---|
| `noteType` | `purchase \| return_from_site` | Lọc theo loại phiếu |
| `status` | `draft \| posted \| voided` | Lọc theo trạng thái |
| `warehouse` | `number` | Lọc theo kho |
| `supplier` | `number` | Lọc theo NCC |
| `dateFrom` / `dateTo` | `string` (`YYYY-MM-DD`) | Lọc theo khoảng ngày |
| `search` | `string` | Tìm theo số phiếu (`PN-2026`) |
| `page` / `pageSize` | `number` | Phân trang — backend `page_size=20` (D8) |

> Backend đã normalize camelCase cho query params (xác nhận 2026-08-13).

**Response `200`** — phân trang `{items, meta}`, mỗi item **không kèm `lines`**:

```json
{
  "items": [
    {
      "id": 1,
      "number": "PN-20260813-001",
      "noteType": "purchase",
      "noteTypeLabel": "Nhập mua",
      "status": "posted",
      "statusLabel": "Đã chốt",
      "date": "2026-08-13",
      "warehouse": { "id": 1, "code": "KHO_CHINH", "name": "Kho chính — Bãi sau" },
      "supplier": { "id": 1, "code": "NCC001", "name": "Công ty TNHH Vật Liệu Xây Dựng ABC" },
      "createdBy": { "id": 2, "email": "thukho@test.com" },
      "totalAmount": "10725000.00",
      "totalQuantity": "105.500",
      "note": "Nhập xi măng + cát cho công trình cầu Rạch Giá",
      "voidedBy": null,
      "voidedAt": null,
      "voidReason": "",
      "createdAt": "2026-08-13T08:30:00+07:00",
      "updatedAt": "2026-08-13T08:30:00+07:00"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 64,
    "totalPages": 4,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## 2. `POST /api/inbound-notes/` — tạo phiếu nháp

**Request:**

```json
{
  "noteType": "purchase",
  "date": "2026-08-13",
  "warehouseId": 1,
  "supplierId": 1,
  "note": "Nhập xi măng + cát cho công trình cầu Rạch Giá",
  "lines": [
    { "materialId": 1, "quantity": "100", "unitPrice": "88000", "note": "Bao 50kg" },
    { "materialId": 2, "quantity": "5.5", "unitPrice": "350000", "note": "" }
  ]
}
```

**Response `201`** — `InboundNoteDetail`: như item list + `lines` (backend xác nhận POST trả kèm lines — OQ-4), `status: "draft"`.

## 3. `GET /api/inbound-notes/{id}/` — chi tiết

**Response `200`:** như item list + `lines: InboundNoteLine[]`.

## 4. `PUT /api/inbound-notes/{id}/` — sửa phiếu nháp

- Request **giống POST** (full body). Dòng cũ bị xóa, thay bằng `lines` mới (replace-all).
- Chỉ khi `status=draft`; `posted`/`voided` → `400`.
- Response `200` — object đã cập nhật.

## 5. `DELETE /api/inbound-notes/{id}/`

- Chỉ khi `status=draft` (xóa cứng phiếu + dòng). `posted`/`voided` → `400`.
- Response `204 No Content`.

## 6. `POST /api/inbound-notes/{id}/post/` — chốt phiếu

- Không body. Chỉ khi `status=draft` → `200` với `status: "posted"`.
- Side effect: ghi N dòng `StockMovement` (+quantity) — tồn kho `/api/stock/` tăng ngay.

## 7. `POST /api/inbound-notes/{id}/void/` — hủy phiếu

**Request:**

```json
{ "reason": "Nhập sai số lượng, NCC giao thiếu" }
```

- Chỉ khi `status=posted`; thiếu `reason` → `400`.
- Response `200` — `status: "voided"` + `voidedBy`, `voidedAt`, `voidReason`.
- Side effect: dòng sổ kho ngược dấu — tồn trở về như trước.

## 8. Error responses

| Status | Body | Mô tả |
|---|---|---|
| 400 | `{ "field": ["msg"] }` hoặc `{ "detail": "msg" }` | Validation / sai trạng thái phiếu |
| 401 | — | Chưa đăng nhập |
| 403 | — | Không có quyền (write cần `IsAdminOrStorekeeper`) |
| 404 | — | Không tìm thấy phiếu |

## 9. Shape phân trang — ✅ Đã xác nhận

Backend trả về custom pagination **`{items, meta}`** — khớp type `Paginated<T>` trong `src/types.ts` (giống `materials`). Doc backend ghi `{count, results}` là ghi lộn — backend đã cập nhật doc.

## Open questions — ✅ Đã giải quyết (2026-08-13)

| # | Câu hỏi | Kết luận |
|---|---|---|
| OQ-1 | Shape phân trang | `{items, meta}` — dùng `Paginated<T>` |
| OQ-2 | Case query params | camelCase — backend đã normalize |
| OQ-4 | POST trả về có kèm `lines` | Có — response type là `InboundNoteDetail` |
