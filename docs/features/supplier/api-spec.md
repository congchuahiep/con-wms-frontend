# API Spec — Supplier (Nhà cung cấp)

> **Status:** ✅ Hoàn thành. Các endpoint đã triển khai ở frontend.

## Endpoints

| Method | Endpoint | Mô tả | Permission | Status |
|---|---|---|---|---|
| `GET` | `/api/suppliers/` | Danh sách NCC (mảng phẳng, không paginate) | IsAuthenticated | ✅ |
| `POST` | `/api/suppliers/` | Tạo NCC mới | IsAdmin | ✅ |
| `GET` | `/api/suppliers/{id}/` | Chi tiết 1 NCC | IsAuthenticated | — (chưa dùng: edit pre-fill từ row) |
| `PATCH` | `/api/suppliers/{id}/` | Cập nhật NCC (partial) | IsAdmin | ✅ |
| `DELETE` | `/api/suppliers/{id}/` | Vô hiệu hóa (soft delete) | IsAdmin | ✅ |

## Query params

| Param | Type | Mô tả |
|---|---|---|
| `search` | `string` | Tìm theo `code` hoặc `name` (SearchFilter) |

> **Lưu ý lệch docs backend:** `api.md` backend ghi có pagination `{"count", "results"}` và filter `is_active`, nhưng code thực tế (`supplier/views.py`) set `pagination_class = None` và chỉ có `filter_backends = [SearchFilter]`. Do đó frontend nhận **mảng phẳng** và chỉ hỗ trợ `search`.

## Request/Response

### `GET /api/suppliers/`

```json
[
  {
    "id": 1,
    "code": "NCC001",
    "name": "Công ty TNHH Vật Liệu Xây Dựng ABC",
    "taxCode": "0123456789",
    "contactPerson": "Anh Tuấn — quản lý bán hàng",
    "phone": "0903123456",
    "email": "sales@abc-vlxd.com",
    "address": "Số 45, đường Nguyễn Huệ, TP. HCM",
    "note": "Giao hàng thứ 3-5-7, giá tốt nhưng hay giao trễ",
    "isActive": true,
    "createdAt": "2026-08-01T00:00:00+07:00",
    "updatedAt": "2026-08-01T00:00:00+07:00"
  }
]
```

### `POST /api/suppliers/`

```json
// Request
{
  "code": "NCC002",
  "name": "Đại lý Sắt Thép Miền Tây",
  "taxCode": "0987654321",
  "contactPerson": "Chị Hương",
  "phone": "0918123456",
  "email": "huong@satthepmientay.com",
  "address": "Quốc lộ 1A, huyện Bến Lức, Long An",
  "note": "Giá sắt tốt nhất khu vực"
}
// Response: 201 — object vừa tạo
```

### `PATCH /api/suppliers/{id}/`

```json
// Request (chỉ gửi dirty fields)
{ "name": "Tên mới", "phone": "0903123457" }
// Response: 200 — object đã cập nhật
```

### `DELETE /api/suppliers/{id}/`

Response: `204 No Content` — set `isActive = false`.

## Error responses

| Status | Body | Mô tả |
|---|---|---|
| 400 | `{ "field": ["error message"] }` | Validation error |
| 401 | — | Chưa đăng nhập |
| 403 | — | Không có quyền (Write cần IsAdmin) |
| 404 | — | Không tìm thấy |
