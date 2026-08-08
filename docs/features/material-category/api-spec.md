# API Spec — Material Category

> **Status:** ✅ Hoàn thành. Tất cả endpoint đã triển khai.

## Endpoints

| Method | Endpoint | Mô tả | Permission | Status |
|---|---|---|---|---|
| `GET` | `/api/categories/` | Danh sách dạng cây lồng, không paginate | IsAuthenticated | ✅ |
| `POST` | `/api/categories/` | Tạo danh mục mới | IsAdminOrStorekeeper | ✅ |
| `PUT` | `/api/categories/{id}/` | Cập nhật danh mục | IsAdminOrStorekeeper | ✅ |
| `DELETE` | `/api/categories/{id}/` | Vô hiệu hóa (soft delete) | IsAdminOrStorekeeper | ✅ |

## Query params

| Param | Type | Mô tả |
|---|---|---|
| `flat` | `boolean` | `true` = danh sách phẳng pre-order kèm `depth` (dùng cho select box) |

## Request/Response

### `GET /api/categories/` — Tree

```json
[{ "id": 1, "code": "VLXD", "name": "Vật liệu xây dựng", "description": "", "color": "blue", "parent": null, "children": [...], "isActive": true }]
```

### `POST /api/categories/`

```json
// Request
{ "code": "XM", "name": "Xi măng", "description": "...", "color": "red", "parentId": null }
// Response: 201 — object vừa tạo
```

### `PUT /api/categories/{id}/`

```json
// Request (chỉ gửi dirty fields)
{ "name": "Tên mới" }
// Response: 200 — object đã cập nhật
```

### `DELETE /api/categories/{id}/`

Response: `204 No Content`

## Error responses

| Status | Body | Mô tả |
|---|---|---|
| 400 | `{ "field": ["error message"] }` | Validation error |
| 401 | — | Chưa đăng nhập |
| 403 | — | Không có quyền |
| 404 | — | Không tìm thấy |
