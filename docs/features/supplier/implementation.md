# Implementation Checklist — Supplier

## Phase 1 — Data layer ✅

- [x] `types.ts` — `Supplier`, `SupplierInput`
- [x] `schemas.ts` — `SupplierSchema` (8 field form)
- [x] `services.ts` — `useGetSuppliers()`, `useAddSupplier()`, `useUpdateSupplier()`, `useDeleteSupplier()`
- [x] `endpoints.ts` — `suppliers.list/create/update/delete`
- [x] `querykeys.ts` — `supplierKeys.all/list()/filteredList()/detail()`
- [x] `index.ts` — barrel export (`schemas`, `services`, `types`)

## Phase 2 — UI list (table) ✅

- [x] `page.tsx` — container (state, data fetching, layout)
- [x] `header.tsx` — title + total + add button
- [x] `filter-bar.tsx` — search input (server-side search)
- [x] `columns.tsx` — `createColumns({ onEdit, onDelete })`
- [x] `table-section.tsx` — `DataTable` wrapper
- [x] `footer.tsx` — total count (không pagination)
- [x] `use-supplier-params.ts` — search state

## Phase 3 — Create dialog ✅

- [x] `create-dialog.tsx` — `Dialog` + `Form` + `useAddSupplier` (8 field)

## Phase 4 — Edit dialog ✅

- [x] `edit-dialog.tsx` — animation pattern + pre-fill + `useUpdateSupplier`

## Phase 5 — Delete + Sidebar ✅

- [x] `page.tsx` — `deleteTarget` state + `DeleteConfirmDialog`
- [x] `app-sidebar.tsx` — thêm nav item "Nhà cung cấp" (`/suppliers`)

## Phase 6 — Design docs ✅

- [x] `README.md`, `data-model.md`, `api-spec.md`, `page-design.md`, `change-log.md`
- [x] Cập nhật `docs/features/README.md` (index)
