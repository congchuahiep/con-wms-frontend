# Implementation Checklist — Unit

> **Phase 1:** CRUD đầy đủ 🔵

## Data layer

- [ ] `src/features/unit/types.ts` — `Unit` type
- [ ] `src/features/unit/schemas.ts` — `UnitSchema` (code + name, v.pipe)
- [ ] `src/features/unit/services.ts` — useGetUnits, useAddUnit, useUpdateUnit, useDeleteUnit
- [ ] `src/configs/endpoints.ts` — units.list, units.create, units.update(id), units.delete(id)
- [ ] `src/configs/querykeys.ts` — unitKeys: { all, list }
- [ ] `src/features/unit/index.ts` — barrel export
- [ ] Không cần `utils.ts` (không có helper phức tạp)

## UI

- [ ] `src/app/(app)/units/page.tsx` — container: state, data fetching, layout
- [ ] `src/app/(app)/units/header.tsx` — title + "N đơn vị" + [+ Thêm đơn vị]
- [ ] `src/app/(app)/units/filter-bar.tsx` — search code/name
- [ ] `src/app/(app)/units/columns.tsx` — createColumns({ onEdit, onDelete }), 3 cột: Mã | Tên | Thao tác
- [ ] `src/app/(app)/units/table-section.tsx` — DataTable wrapper
- [ ] `src/app/(app)/units/footer.tsx` — tổng count
- [ ] `src/app/(app)/units/create-dialog.tsx` — Dialog + Form (InputField code + name)
- [ ] `src/app/(app)/units/edit-dialog.tsx` — Dialog + Form + useUpdateUnit, pattern onOpenChangeComplete
- [ ] Delete: `DeleteConfirmDialog` từ `@/components/ui/delete-confirm-dialog`
