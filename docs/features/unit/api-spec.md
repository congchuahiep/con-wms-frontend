# API Spec — Unit

> **v1.2** — PATCH (không PUT) cho update, nhất quán `usePartialUpdate`

## Endpoints consumed

| Method   | Endpoint           | Mô tả                             | Permission           | Scope hiện tại |
| -------- | ------------------ | --------------------------------- | -------------------- | -------------- |
| `GET`    | `/api/units/`      | Danh sách đơn vị (không paginate) | IsAuthenticated      | ✅ Dùng ngay   |
| `POST`   | `/api/units/`      | Tạo đơn vị mới                    | IsAdminOrStorekeeper | ✅ Dùng ngay   |
| `PATCH`  | `/api/units/{id}/` | Cập nhật đơn vị (partial update)  | IsAdminOrStorekeeper | ✅ Dùng ngay   |
| `DELETE` | `/api/units/{id}/` | Vô hiệu hóa (soft delete)         | IsAdminOrStorekeeper | ✅ Dùng ngay   |

> **Convention:** Dự án dùng `authApi.patch()` + `usePartialUpdate` cho mọi thao tác cập nhật — chỉ gửi field thay đổi.

Không có query params (không paginate, không filter server-side). Backend trả về tất cả unit đang active, sắp xếp theo `code`.

---

## Request/Response mẫu

### `GET /api/units/`

Response từ `UnitSerializer`:

```json
[
    {
        "id": 1,
        "code": "BAO",
        "name": "Bao",
        "is_active": true,
        "created_at": "2026-08-05T00:00:00Z",
        "updated_at": "2026-08-05T00:00:00Z"
    },
    {
        "id": 2,
        "code": "KG",
        "name": "Kilogram",
        "is_active": true,
        "created_at": "2026-08-05T00:00:00Z",
        "updated_at": "2026-08-05T00:00:00Z"
    }
]
```

> **Frontend type** chỉ lấy `id`, `code`, `name`, `isActive` — bỏ `created_at`/`updated_at`.

### `POST /api/units/`

```json
// Request
{
    "code": "LIT",
    "name": "Lít"
}

// Response: 201 Created
{
    "id": 5,
    "code": "LIT",
    "name": "Lít",
    "is_active": true,
    "created_at": "2026-08-08T00:00:00Z",
    "updated_at": "2026-08-08T00:00:00Z"
}
```

### `PATCH /api/units/5/`

> **Frontend convention:** `authApi.patch()` + `usePartialUpdate` — chỉ gửi field bị thay đổi.

```json
// Request (chỉ field thay đổi)
{
    "code": "LITER"
}

// Response: 200 OK
{
    "id": 5,
    "code": "LITER",
    "name": "Lít",
    "is_active": true,
    "created_at": "2026-08-08T00:00:00Z",
    "updated_at": "2026-08-08T00:00:00Z"
}
```

### `DELETE /api/units/5/` → `204 No Content`

### Error responses

| Status | Body | Mô tả                                                        |
| ------ | ---- | ------------------------------------------------------------ |
| 400    | JSON | Validation error (vd: code trùng, code quá dài, thiếu field) |
| 401    | —    | Chưa đăng nhập                                               |
| 403    | —    | Không có quyền (không phải Admin/Storekeeper)                |

## Ghi chú

- `UnitViewSet.pagination_class = None` — không paginate, ≤ 20 items
- `get_queryset()` lọc `is_active=True`, sắp xếp theo `code`
- `perform_destroy()` — soft delete, set `is_active = False`
- Response JSON dùng snake_case từ DRF → client camelCase renderer tự convert
