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
    "updatedAt": "2026-08-05T00:00:00Z"
}
```

### `POST /api/materials/`

```json
// Request
{
    "code": "XM-HT-PCB40",
    "name": "Xi măng Hà Tiên PCB40",
    "categoryId": 2,
    "unitId": 1,
    "description": "PCB40, 50kg/bao"
}

// Response: 201 Created — Material object
```

### `PATCH /api/materials/{id}/`

```json
// Request (chỉ gửi dirty fields)
{ "name": "Tên mới", "unitId": 3 }

// Response: 200 — Material object đã cập nhật
```

### `DELETE /api/materials/{id}/`

Response: `204 No Content`

## Error responses

| Status | Body                                   | Mô tả                                                                 |
| ------ | -------------------------------------- | --------------------------------------------------------------------- |
| 400    | `{ "code": ["Mã vật tư đã tồn tại"] }` | Validation error — `usePost`/`usePartialUpdate` tự map vào form field |
| 401    | —                                      | Chưa đăng nhập                                                        |
| 403    | —                                      | Không có quyền (không phải Admin/Storekeeper)                         |
| 404    | —                                      | Không tìm thấy                                                        |

## Select box endpoints (external)

| Endpoint                      | Source feature      | Dùng cho                                                    |
| ----------------------------- | ------------------- | ----------------------------------------------------------- |
| `GET /api/categories/` (tree) | `material-category` | `CategorySelectField` — flatten tree client-side với indent |
| `GET /api/units/`             | `unit`              | `UnitSelectField` — nhóm theo `conversionType`              |
