# API Spec — Site

| Method    | Endpoint         | Mô tả                                                                                 |
| --------- | ---------------- | ------------------------------------------------------------------------------------- |
| GET       | /api/sites/      | List, query `?search=&is_active=` (default true) — **không phân trang**, trả `Site[]` |
| POST      | /api/sites/      | Tạo, body `SiteInput`                                                                 |
| GET       | /api/sites/{id}/ | Detail                                                                                |
| PUT/PATCH | /api/sites/{id}/ | Sửa (partial)                                                                         |
| DELETE    | /api/sites/{id}/ | Soft delete → 204                                                                     |

Validation: code unique 400, name required 400.
