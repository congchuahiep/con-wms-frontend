# API Spec — Unit

## Endpoints consumed

| Method   | Endpoint              | Mô tả                             | Permission               | Scope hiện tại |
| -------- | --------------------- | --------------------------------- | ------------------------ | -------------- |
| `GET`    | `/api/units/`         | Danh sách đơn vị (không paginate) | IsAuthenticated          | ✅ Dùng ngay   |
| `POST`   | `/api/units/`         | Tạo đơn vị mới                    | IsAdminOrStorekeeper     | ✅ Dùng ngay   |
| `PUT`    | `/api/units/{id}/`    | Cập nhật đơn vị                   | IsAdminOrStorekeeper     | ✅ Dùng ngay   |
| `DELETE` | `/api/units/{id}/`    | Vô hiệu hóa (soft delete)         | IsAdminOrStorekeeper     | ✅ Dùng ngay   |

Không có query params (không paginate, không filter server-side).

---

## Request/Response mẫu

### `GET /api/units/`

```json
[
    { "id": 1, "code": "BAO", "name": "Bao", "isActive": true },
    { "id": 2, "code": "KG", "name": "Kilogram", "isActive": true },
    { "id": 3, "code": "TAN", "name": "Tấn", "isActive": true },
    { "id": 4, "code": "M3", "name": "Mét khối", "isActive": true }
]
```

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
    "isActive": true
}
```

### `PUT /api/units/5/`

```json
// Request
{
    "code": "LITER",
    "name": "Lít"
}

// Response: 200 OK
{
    "id": 5,
    "code": "LITER",
    "name": "Lít",
    "isActive": true
}
```

### `DELETE /api/units/5/` → `204 No Content`

### Error responses

| Status | Body | Mô tả          |
| ------ | ---- | -------------- |
| 400    | JSON | Validation error (code trùng, thiếu field) |
| 401    | —    | Chưa đăng nhập |
| 403    | —    | Không có quyền (không phải Admin/Storekeeper) |

## Ghi chú

- Không pagination (≤ 20 items)
- Response là mảng phẳng (không tree, không lồng)
- Search/filter thực hiện client-side
