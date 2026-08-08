# Implementation Checklist — Material Category

## Phase 1 — GET (hiển thị) ✅

- [x] `types.ts` — MaterialCategory, FlatCategory, MaterialCategoryColor (10 màu)
- [x] `utils.ts` — CATEGORY_COLOR_MAP, getCategoryColorClass()
- [x] `services.ts` — useGetCategories()
- [x] `endpoints.ts` — categories.list
- [x] `querykeys.ts` — categoryKeys
- [x] `index.ts` — barrel export
- [x] `page.tsx` — container
- [x] `header.tsx` — title + stats + actions
- [x] `filter-bar.tsx` — search
- [x] `columns.tsx` — createColumns({ onEdit, onDelete }), 4 cột
- [x] `table-section.tsx` — DataTable wrapper
- [x] `footer.tsx` — total count
- [x] `data-table.tsx` — table-fixed + column sizing + min-width

## Phase 2 — POST/CREATE ✅

- [x] `schemas.ts` — CategorySchema (code, name, description, color, parentId)
- [x] `services.ts` — useAddCategory()
- [x] `endpoints.ts` — categories.create
- [x] `SelectField.tsx` — reusable SelectField component
- [x] `create-dialog.tsx` — Dialog + Form, 5 field

## Phase 3 — PUT/UPDATE ✅

- [x] `usePartialUpdate.ts` — custom hook (Formisch + Valibot + TanStack)
- [x] `services.ts` — useUpdateCategory()
- [x] `endpoints.ts` — categories.update (dynamic URL)
- [x] `edit-dialog.tsx` — Dialog + Form + pre-fill, animation pattern

## Phase 4 — DELETE ✅

- [x] `services.ts` — useDeleteCategory()
- [x] `endpoints.ts` — categories.delete (dynamic URL)
- [x] `delete-confirm-dialog.tsx` — reusable confirm dialog
- [x] `page.tsx` — deleteTarget state + wire

## Design docs ✅

- [x] `README.md`, `data-model.md`, `api-spec.md`, `create-dialog.md`, `edit-dialog.md`, `change-log.md`
