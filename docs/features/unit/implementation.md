# Implementation Checklist — Unit

> **Phase 1:** CRUD đầy đủ ✅

## Data layer

- [x] `src/features/unit/types.ts` — `Unit` type (`id`, `code`, `name`, `isActive`)
- [x] `src/features/unit/schemas.ts` — `UnitSchema`:
  - `code`: `v.pipe(v.string(), v.nonEmpty(), v.regex(/^[a-zA-Z0-9_]+$/), v.maxLength(10))`
  - `name`: `v.pipe(v.string(), v.nonEmpty(), v.maxLength(100))`
- [x] `src/features/unit/services.ts` — useGetUnits, useAddUnit (usePost), useUpdateUnit (usePartialUpdate), useDeleteUnit (useMutation)
- [x] `src/configs/endpoints.ts` — `units: { list, create, update: (id) => ..., delete: (id) => ... }`
- [x] `src/configs/querykeys.ts` — `unitKeys: { all, list }`
- [x] `src/features/unit/index.ts` — barrel export
- [x] Không cần `utils.ts` (không có helper phức tạp)

## UI

- [x] `src/app/(app)/units/page.tsx` — container: state, data fetching, layout
- [x] `src/app/(app)/units/header.tsx` — `WeightIcon` + "Đơn vị tính" + "N đơn vị" + [+ Thêm đơn vị]
- [x] `src/app/(app)/units/filter-bar.tsx` — search code/name (client-side, array phẳng)
- [x] `src/app/(app)/units/columns.tsx` — `createColumns({ onEdit, onDelete })`, 3 cột: Mã | Tên | Thao tác (✏️🗑️)
- [x] `src/app/(app)/units/table-section.tsx` — `DataTable` wrapper
- [x] `src/app/(app)/units/footer.tsx` — tổng count
- [x] `src/app/(app)/units/create-dialog.tsx` — Dialog + Form (InputField code + name)
- [x] `src/app/(app)/units/edit-dialog.tsx` — Dialog + Form + useUpdateUnit, pattern `onOpenChangeComplete`, form child mount khi có data
- [x] Delete: `DeleteConfirmDialog` từ `@/components/ui/delete-confirm-dialog`
