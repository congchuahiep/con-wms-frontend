# Site (Công trường) — Design Index

> **Trạng thái:** ✅ Hoàn thành
> **Backend entity:** `sites` app — `Site` ([`../../con-wms/docs/entities/site/README.md`](../../con-wms/docs/entities/site/README.md))
> **Frontend feature:** `src/features/site/`

## Scope

Master data công trường, dùng làm FK cho OutboundNote `issue_for_use` và InboundNote `return_from_site`. Không phân trang, soft delete.

## Docs

| File | Nội dung |
| --- | --- |
| [data-model.md](./data-model.md) | Types, schemas, utils |
| [api-spec.md](./api-spec.md) | Endpoints, request/response |
| [page-design.md](./page-design.md) | Thiết kế UI — chờ triển khai |
| [implementation.md](./implementation.md) | Checklist triển khai |
| [change-log.md](./change-log.md) | Lịch sử |

## Trạng thái

| Thành phần | Mô tả | Trạng thái |
| --- | --- | --- |
| Data layer | `types.ts` + `schemas.ts` + `services.ts` + `utils.ts` | ✅ Hoàn thành |
| Endpoints | `sites.list`, `create`, `detail`, `update`, `delete` | ✅ Hoàn thành |
| Query keys | `siteKeys.all`, `list()`, `filteredList()`, `detail()` | ✅ Hoàn thành |
| UI list | Table không phân trang + search + status filter | ✅ Hoàn thành |
| UI create | Dialog form với `useAddSite` | ✅ Hoàn thành |
| UI edit | Dialog form với `useUpdateSite` + pre-fill | ✅ Hoàn thành |
| UI delete | `DeleteConfirmDialog` (soft delete) | ✅ Hoàn thành |
| Sidebar | Nav item "Công trường" (`/sites`) | ✅ Hoàn thành |

✅ **Hoàn thành** — data layer + UI (GET + POST + PATCH + DELETE)

## Mapping

- `GET /api/sites/` → list (không phân trang, `?search=&is_active=` default true)
- `POST /api/sites/` → create
- `PATCH /api/sites/{id}/` → update (partial, chỉ gửi field thay đổi)
- `DELETE /api/sites/{id}/` → soft delete (is_active=false)