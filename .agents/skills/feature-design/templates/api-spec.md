# API Spec — {{FEATURE_NAME}}

## Endpoints consumed

| Method | Endpoint | Mô tả | Permission |
|---|---|---|---|
| `GET` | `/api/{{PREFIX}}/` | Liệt kê | IsAuthenticated |
| `POST` | `/api/{{PREFIX}}/` | Tạo mới | IsAdminOrStorekeeper |
| `GET` | `/api/{{PREFIX}}/{id}/` | Chi tiết | IsAuthenticated |
| `PUT` | `/api/{{PREFIX}}/{id}/` | Cập nhật | IsAdminOrStorekeeper |
| `DELETE` | `/api/{{PREFIX}}/{id}/` | Xóa / Vô hiệu hóa | IsAdminOrStorekeeper |

## Query params

| Param | Type | Mô tả |
|---|---|---|
| | | |

---

## Request/Response mẫu

### `GET /api/{{PREFIX}}/`

```json
[
    {
        "id": 1,
        "code": "...",
        "name": "..."
    }
]
```

### `POST /api/{{PREFIX}}/`

```json
// Request
{
    "code": "...",
    "name": "..."
}

// Response: 201 Created — trả về object vừa tạo
```

### Error responses

| Status | Body | Mô tả |
|---|---|---|
| 400 | `{ "field": ["error message"] }` | Validation error |
| 401 | — | Chưa đăng nhập |
| 403 | — | Không có quyền |
| 404 | — | Không tìm thấy |
