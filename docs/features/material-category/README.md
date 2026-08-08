# Material Category — Index

> Feature folder: `src/features/material-category/`
> Backend entity: [`material`](../../../con-wms/docs/entities/material/README.md)
> Backend API: [`api.md`](../../../con-wms/docs/entities/material/api.md) — Section 2. MaterialCategory

## Tài liệu

| File | Nội dung |
|---|---|
| [`data-model.md`](data-model.md) | TypeScript types, `MaterialCategoryColor` (10 màu), design decisions |
| [`api-spec.md`](api-spec.md) | API endpoints consumed, request/response spec |
| [`create-dialog.md`](create-dialog.md) | Create dialog design (mockup, component tree, state flow) |
| [`edit-dialog.md`](edit-dialog.md) | Edit dialog design (mockup, component tree, state flow) |
| [`implementation.md`](implementation.md) | Checklist triển khai — đã check off |
| [`change-log.md`](change-log.md) | Lịch sử thay đổi thiết kế |

## Scope

| Thành phần | Mô tả | Trạng thái |
|---|---|---|
| Data layer | `types.ts` + `utils.ts` + `schemas.ts` + `services.ts` | ✅ Hoàn thành |
| Endpoints | `categories.list`, `create`, `update`, `delete` | ✅ Hoàn thành |
| Query keys | `categoryKeys.all`, `list()` | ✅ Hoàn thành |
| UI list | Table tree với expand/collapse, search filter | ✅ Hoàn thành |
| UI create | Dialog form với `useAddCategory` | ✅ Hoàn thành |
| UI edit | Dialog form với `useUpdateCategory` + pre-fill | ✅ Hoàn thành |
| UI delete | `DeleteConfirmDialog` | ✅ Hoàn thành |
| Shared | `SelectField`, `usePartialUpdate`, `DataTable` column sizing | ✅ Hoàn thành |

## Trạng thái tổng thể

✅ **Hoàn thành** — GET + POST + PUT + DELETE
