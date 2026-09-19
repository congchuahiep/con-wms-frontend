# Site (Công trường) — Design Index

> **Trạng thái:** 🔵 Đang thiết kế
> **Backend entity:** `sites` app — `Site` (`docs/entities/site/`)
> **Frontend feature:** `src/features/site/`

## Scope

Master data công trường, dùng làm FK cho OutboundNote `issue_for_use` và InboundNote `return_from_site`. Không phân trang, soft delete.

## Docs

| File                                     | Mô tả                       |
| ---------------------------------------- | --------------------------- |
| [data-model.md](./data-model.md)         | Types, schemas, utils       |
| [api-spec.md](./api-spec.md)             | Endpoints, request/response |
| [implementation.md](./implementation.md) | Checklist triển khai        |
| [change-log.md](./change-log.md)         | Lịch sử                     |

## Mapping

- `GET /api/sites/` → list (không phân trang, `?search=&is_active=`)
- `POST /api/sites/` → create
- `PUT /api/sites/{id}/` → update (PATCH)
- `DELETE /api/sites/{id}/` → soft delete (is_active=false)
