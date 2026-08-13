# Supplier (Nhà cung cấp) — Index

> Feature folder: `src/features/supplier/`
> Backend entity: [`supplier`](../../../con-wms/docs/entities/supplier/README.md)
> Backend API: [`api.md`](../../../con-wms/docs/entities/supplier/api.md)

## Tài liệu

| File | Nội dung |
|---|---|
| [`data-model.md`](data-model.md) | TypeScript types, Valibot schema, design decisions |
| [`api-spec.md`](api-spec.md) | API endpoints consumed, request/response spec |
| [`page-design.md`](page-design.md) | Thiết kế UI: mockup, component tree, state flow, columns, dialogs |
| [`implementation.md`](implementation.md) | Checklist triển khai — đã check off |
| [`change-log.md`](change-log.md) | Lịch sử thay đổi thiết kế |

## Scope

| Thành phần | Mô tả | Trạng thái |
|---|---|---|
| Data layer | `types.ts` + `schemas.ts` + `services.ts` | ✅ Hoàn thành |
| Endpoints | `suppliers.list`, `create`, `update`, `delete` | ✅ Hoàn thành |
| Query keys | `supplierKeys.all`, `list()`, `filteredList()`, `detail()` | ✅ Hoàn thành |
| UI list | Table phẳng + search server-side | ✅ Hoàn thành |
| UI create | Dialog form với `useAddSupplier` | ✅ Hoàn thành |
| UI edit | Dialog form với `useUpdateSupplier` + pre-fill | ✅ Hoàn thành |
| UI delete | `DeleteConfirmDialog` (soft delete) | ✅ Hoàn thành |
| Sidebar | Nav item "Nhà cung cấp" (`/suppliers`) | ✅ Hoàn thành |

## Trạng thái tổng thể

✅ **Hoàn thành** — GET + POST + PATCH + DELETE
