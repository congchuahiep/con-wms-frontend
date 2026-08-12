# Implementation Checklist — Material

## Phase 0 — Prerequisites ⬜

- [x] `src/types.ts` — `Paginated<T>` generic
- [x] `src/features/material-category/types.ts` — `SimpleMaterialCategory`
- [x] `src/features/unit/types.ts` — `SimpleUnit` (đã có sẵn)

## Phase 1 — GET list (data layer) ✅

- [x] `types.ts` — `Material` (dùng `SimpleMaterialCategory` + `SimpleUnit` cho nested ref)
- [x] `services.ts` — `useGetMaterials(params)` với query params (`search`, `category`, `page`, `pageSize`), trả về `Paginated<Material>`
- [x] `endpoints.ts` — `materials.list`
- [x] `querykeys.ts` — `materialKeys` (`all`, `list(params)`, `detail(id)`)
- [x] `index.ts` — barrel export

## Phase 2 — POST + PATCH + DELETE (data layer) ✅

- [x] `schemas.ts` — `MaterialSchema` (code, name, categoryId, unitId, description)
- [x] `services.ts` — `useAddMaterial()` via `usePost`
- [x] `services.ts` — `useUpdateMaterial()` via `usePartialUpdate` + `authApi.patch()`
- [x] `services.ts` — `useDeleteMaterial()` via `useMutation<void>` (204)
- [x] `endpoints.ts` — `materials.create`, `update(id)`, `delete(id)`

## Phase 3 — Shared components ✅

- [x] `src/components/form/CategorySelectField.tsx` — reusable, flatten tree client-side từ `useGetCategories()`, indent `\u00A0\u00A0\u00A0`, kèm dot màu category
- [x] `src/components/form/UnitSelectField.tsx` — reusable, grouped by `conversionType` dùng `SelectGroup`/`SelectLabel`, hiển thị `code - name`

## Phase 4 — UI (sẽ thiết kế sau bởi `page-design`) ⬜

- [ ] `page.tsx` — container
- [ ] Table columns: Mã, Tên, Danh mục (badge màu), Đơn vị, Mô tả, Trạng thái
- [ ] Search bar + filter dropdown (Category)
- [ ] Pagination
- [ ] Create dialog — `useAddMaterial()`
- [ ] Edit dialog — `useUpdateMaterial()` + pre-fill
- [ ] Delete confirm dialog — `useDeleteMaterial()`

## Design docs ✅

- [x] `README.md`, `data-model.md`, `api-spec.md`, `implementation.md`, `change-log.md`
