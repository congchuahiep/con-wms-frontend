# Material — Index

> Feature folder: `src/features/material/`
> Backend entity: [`material`](../../../con-wms/docs/entities/material/README.md)
> Backend API: [`api.md`](../../../con-wms/docs/entities/material/api.md) — Section 1. Material

## Tài liệu

| File | Nội dung |
|---|---|
| [`data-model.md`](data-model.md) | TypeScript types, nested objects, `Paginated<T>` generic |
| [`api-spec.md`](api-spec.md) | API endpoints consumed, request/response shapes, query params, error cases |
| [`page-design.md`](page-design.md) | UI design: mockup, component tree, state flow, column spec, file plan |
| [`implementation.md`](implementation.md) | Checklist triển khai — đã check off Phase 0-3 |
| [`change-log.md`](change-log.md) | Lịch sử thay đổi thiết kế |

## Scope

| Thành phần | Mô tả | Trạng thái |
|---|---|---|
| Data layer | `types.ts` + `schemas.ts` + `services.ts` | ✅ Hoàn thành |
| Endpoints | `materials.list`, `create`, `update`, `delete` | ✅ Hoàn thành |
| Query keys | `materialKeys.list()`, `filteredList()`, `detail()` | ✅ Hoàn thành |
| Shared components | `CategorySelectField`, `UnitSelectField` | ✅ Hoàn thành |
| UI design | `page-design.md` — mockup, flow, file plan | ✅ Hoàn thành |
| UI list | Table paginated: Mã, Tên, Danh mục, Đơn vị, Mô tả, Trạng thái | ⬜ Chờ code |
| UI create | Dialog form với `useAddMaterial` | ⬜ Chờ code |
| UI edit | Dialog form với `useUpdateMaterial` + pre-fill | ⬜ Chờ code |
| UI delete | Confirm dialog → `useMutation` DELETE | ⬜ Chờ code |

## Trạng thái tổng thể

🔵 **Đang thiết kế** — Data layer + Page design hoàn tất, chờ code UI.
