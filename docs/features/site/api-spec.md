# API Spec — Site

| Method    | Endpoint         | Mô tả                                                                                 |
| --------- | ---------------- | ------------------------------------------------------------------------------------- |
| GET       | /api/sites/      | List, query `?search=&isActive=` (frontend gửi camelCase theo convention — default true) — **không phân trang**, trả `Site[]` |
| POST      | /api/sites/      | Tạo, body `SiteInput`                                                                 |
| GET       | /api/sites/{id}/ | Detail                                                                                |
| PUT/PATCH | /api/sites/{id}/ | Sửa (partial — client chỉ gửi field thay đổi)                                         |
| DELETE    | /api/sites/{id}/ | Soft delete → 204, `is_active = false`                                                |

Validation: code unique 400, name required 400. Lỗi 400 trả field errors để `usePost`/`usePartialUpdate` map vào form (`ValidationError`).

## Request / Response mẫu

### GET /api/sites/?search=CT_&is_active=true

```json
[
  {
    "id": 1,
    "code": "CT_RG",
    "name": "Cầu Rạch Giá",
    "manager": "Anh Bảy",
    "phone": "0901234567",
    "address": "QL80, Rạch Giá, Kiên Giang",
    "note": "",
    "is_active": true,
    "created_at": "2026-08-01T09:00:00Z",
    "updated_at": "2026-08-01T09:00:00Z"
  }
]
```

### POST /api/sites/

Body:

```json
{
  "code": "CT_01",
  "name": "Công trường 01",
  "manager": "Anh Ba",
  "phone": "0901234567",
  "address": "Quận 1, TP.HCM",
  "note": ""
}
```

→ `201` trả `Site`.

### PATCH /api/sites/{id}/

Chỉ gửi field thay đổi (dirty tracking bởi `usePartialUpdate`):

```json
{
  "manager": "Chị Tư"
}
```

→ `200` trả `Site`.

### DELETE /api/sites/{id}/

→ `204 No Content`, soft delete (vô hiệu hóa — `is_active = false`).