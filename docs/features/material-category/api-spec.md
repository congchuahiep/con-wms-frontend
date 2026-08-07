# API Spec — Material Category

## Endpoints consumed

| Method   | Endpoint                     | Mô tả                                    | Permission           | Scope hiện tại |
| -------- | ---------------------------- | ---------------------------------------- | -------------------- | -------------- |
| `GET`    | `/api/categories/`           | Danh sách dạng cây lồng (không paginate) | IsAuthenticated      | ✅ Dùng ngay   |
| `GET`    | `/api/categories/?flat=true` | Danh sách phẳng (cho select box)         | IsAuthenticated      | ⏸️ Deferred    |
| `POST`   | `/api/categories/`           | Tạo danh mục mới                         | IsAdminOrStorekeeper | ⏸️ Deferred    |
| `GET`    | `/api/categories/{id}/`      | Chi tiết danh mục                        | IsAuthenticated      | ⏸️ Deferred    |
| `PUT`    | `/api/categories/{id}/`      | Cập nhật                                 | IsAdminOrStorekeeper | ⏸️ Deferred    |
| `DELETE` | `/api/categories/{id}/`      | Vô hiệu hóa (soft delete)                | IsAdminOrStorekeeper | ⏸️ Deferred    |

## Query params

| Param  | Type      | Mô tả                                             | Dùng khi               |
| ------ | --------- | ------------------------------------------------- | ---------------------- |
| `flat` | `boolean` | `true` = danh sách phẳng (pre-order, kèm `depth`) | Select box chọn parent |

---

## Request/Response mẫu

### `GET /api/categories/` — Dạng cây lồng

```json
[
    {
        "id": 1,
        "code": "VLXD",
        "name": "Vật liệu xây dựng",
        "color": "blue",
        "parent": null,
        "children": [
            {
                "id": 2,
                "code": "XM",
                "name": "Xi măng",
                "color": "red",
                "parent": 1,
                "children": []
            },
            {
                "id": 4,
                "code": "THEP",
                "name": "Thép",
                "color": "green",
                "parent": 1,
                "children": [
                    {
                        "id": 5,
                        "code": "THEP_TRON",
                        "name": "Thép tròn",
                        "color": "orange",
                        "parent": 4,
                        "children": []
                    }
                ]
            }
        ],
        "isActive": true
    }
]
```

### `GET /api/categories/?flat=true` — Dạng phẳng

```json
[
    {
        "id": 1,
        "code": "VLXD",
        "name": "Vật liệu xây dựng",
        "color": "blue",
        "parent": null,
        "depth": 0,
        "isActive": true
    },
    {
        "id": 2,
        "code": "XM",
        "name": "Xi măng",
        "color": "red",
        "parent": 1,
        "depth": 1,
        "isActive": true
    },
    {
        "id": 4,
        "code": "THEP",
        "name": "Thép",
        "color": "green",
        "parent": 1,
        "depth": 1,
        "isActive": true
    },
    {
        "id": 5,
        "code": "THEP_TRON",
        "name": "Thép tròn",
        "color": "orange",
        "parent": 4,
        "depth": 2,
        "isActive": true
    }
]
```

### Error responses

| Status | Body | Mô tả          |
| ------ | ---- | -------------- |
| 401    | —    | Chưa đăng nhập |
| 403    | —    | Không có quyền |

## Ghi chú

- Không pagination (≤ 30 items)
- Response mặc định là tree lồng (`children`). Frontend tự flatten để hiển thị trong table.
- `?flat=true` sẽ dùng sau này cho select box chọn parent trong dialog create/edit.
