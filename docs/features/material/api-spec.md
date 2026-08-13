# API Spec — Material

> **Status:** 🔵 Đang thiết kế.

## Endpoints

| Method   | Endpoint               | Mô tả                     | Permission           | Status |
| -------- | ---------------------- | ------------------------- | -------------------- | ------ |
| `GET`    | `/api/materials/`      | Danh sách paginated       | IsAuthenticated      | 🔵     |
| `POST`   | `/api/materials/`      | Tạo vật tư mới            | IsAdminOrStorekeeper | 🔵     |
| `GET`    | `/api/materials/{id}/` | Chi tiết vật tư           | IsAuthenticated      | 🔵     |
| `PATCH`  | `/api/materials/{id}/` | Cập nhật vật tư (partial) | IsAdminOrStorekeeper | 🔵     |
| `DELETE` | `/api/materials/{id}/` | Vô hiệu hóa (soft delete) | IsAdminOrStorekeeper | 🔵     |

## Query params (GET list)

| Param      | Type     | Mô tả                       |
| ---------- | -------- | --------------------------- |
| `search`   | `string` | Tìm theo `code` hoặc `name` |
| `category` | `number` | Filter theo Category ID     |
| `page`     | `number` | Trang hiện tại (mặc định 1) |
| `pageSize` | `number` | Số item/trang (mặc định 20) |

## Request/Response

### `GET /api/materials/` — List (paginated)

```json
{
    "items": [
        {
            "id": 1,
            "code": "XM-HT-PCB40",
            "name": "Xi măng Hà Tiên PCB40",
            "category": { "id": 2, "code": "XM", "name": "Xi măng" },
            "unit": { "id": 1, "code": "BAO", "name": "Bao" },
            "description": "PCB40, 50kg/bao",
            "isActive": true,
            "createdAt": "2026-08-05T00:00:00Z",
            "updatedAt": "2026-08-05T00:00:00Z"
        }
    ],
    "meta": {
        "page": 1,
        "pageSize": 20,
        "total": 150,
        "totalPages": 8,
        "hasNextPage": true,
        "hasPreviousPage": false
    }
}
```

### `GET /api/materials/{id}/` — Detail

```json
{
    "id": 1,
    "code": "XM-HT-PCB40",
    "name": "Xi măng Hà Tiên PCB40",
    "category": { "id": 2, "code": "XM", "name": "Xi măng" },
    "unit": { "id": 1, "code": "BAO", "name": "Bao" },
    "description": "PCB40, 50kg/bao",
    "isActive": true,
    "createdAt": "2026-08-05T00:00:00Z",
    "updatedAt": "2026-08-05T00:00:00Z",
    "conversions": [
        {
            "id": 1,
            "toUnit": { "id": 2, "code": "KG", "name": "Kilogram" },
            "factor": "50"
        }
    ]
}
```

> **`conversions`** chỉ có trong detail (không trong list). Chỉ có ý nghĩa khi unit là material-type. Với unit global, mảng rỗng.
>
> **Lưu ý:** `Material.unit` chỉ là `SimpleUnit` (`id`, `code`, `name`) — KHÔNG có `conversionType`. Form Material cần gọi `useGetUnits()` (danh sách đầy đủ) để tra `conversionType` của unit được chọn.

### `POST /api/materials/`

```json
// Request — unit global (không gửi conversions)
{
    "code": "XM-HT-PCB40",
    "name": "Xi măng Hà Tiên PCB40",
    "categoryId": 2,
    "unitId": 1,
    "description": "PCB40, 50kg/bao"
}

// Request — unit material (gửi kèm conversions)
{
    "code": "XM-HT-PCB40",
    "name": "Xi măng Hà Tiên PCB40",
    "categoryId": 2,
    "unitId": 1,
    "description": "PCB40, 50kg/bao",
    "conversions": [
        { "toUnitId": 2, "factor": "50" }
    ]
}

// Response: 201 Created — MaterialDetail object (kèm conversions)
```

### `PATCH /api/materials/{id}/`

```json
// Request (chỉ gửi dirty fields; conversions gửi cả mảng để replace)
{ "name": "Tên mới", "conversions": [ { "toUnitId": 2, "factor": "55" } ] }

// Response: 200 — MaterialDetail object đã cập nhật
```

> **Semantic của `conversions` trong PATCH:** Khi có field `conversions`, backend **replace toàn bộ** quy đổi của material đó (xóa hết + tạo lại). Không merge từng phần.

### `DELETE /api/materials/{id}/`

Response: `204 No Content`

## Error responses

| Status | Body | Mô tả |
| ------ | ---- | ----- |
| 400    | `{ "code": [...], "detail": "...", "fields": { ... } }` | Validation error — `usePost`/`usePartialUpdate` tự map vào form field |
| 401    | —    | Chưa đăng nhập |
| 403    | —    | Không có quyền (không phải Admin/Storekeeper) |
| 404    | —    | Không tìm thấy |

> Error response format đã chuẩn hóa theo custom DRF exception handler (xem `con-wms/config/exceptions.py`): `code` + `detail` là metadata, field errors nằm trong `fields`.

## Select box endpoints (external)

| Endpoint                      | Source feature      | Dùng cho                                                    |
| ----------------------------- | ------------------- | ----------------------------------------------------------- |
| `GET /api/categories/` (tree) | `material-category` | `CategorySelectField` — flatten tree client-side với indent |
| `GET /api/units/`             | `unit`              | `UnitSelectField` — nhóm theo `conversionType`              |
