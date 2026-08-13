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

## Phase 4 — UI (page) ✅

- [x] `use-material-params.ts` — Custom hook: gom 4 state (search, category, page, pageSize) vào 1 object, auto reset page
- [x] `columns.tsx` — 7 cột: code, name, category (badge), unit (code - name), description, isActive, actions
- [x] `create-dialog.tsx` — Dialog + Form + `useAddMaterial` + CategorySelectField + UnitSelectField
- [x] `edit-dialog.tsx` — Dialog + Form + `useUpdateMaterial` + animation pattern + pre-fill
- [x] `header.tsx` — Icon + title + stats + onAdd button
- [x] `filter-bar.tsx` — Category dropdown (useGetCategories) + search input
- [x] `footer.tsx` — Page info + prev/next pagination
- [x] `table-section.tsx` — Đổi type sang `@/features/material`
- [x] `page.tsx` — Container: wire useMaterialParams + useGetMaterials + dialogs + delete confirm

## Design docs ✅

- [x] `README.md`, `data-model.md`, `api-spec.md`, `implementation.md`, `change-log.md`

## Phase 5 — Material ↔ UnitConversion (Hướng A) ✅

> Đã hoàn thành — backend + frontend.

### Backend (con-wms)

- [x] `catalog/serializers.py` — `MaterialSerializer` thêm write-only `conversions` field (`MaterialConversionInputSerializer`)
- [x] `catalog/serializers.py` — `MaterialDetailSerializer` (retrieve) thêm read-only `conversions`
- [x] `catalog/serializers.py` — `create()`/`update()` replace conversions trong transaction
- [x] `catalog/serializers.py` — validate: chỉ cho `conversions` khi `unit.conversion_type === "material"`
- [x] `catalog/views.py` — `MaterialViewSet.get_serializer_class()` trả `MaterialDetailSerializer` cho `retrieve`

### Frontend data layer (features/material)

- [x] `types.ts` — thêm `MaterialConversionInput`, `MaterialConversion`, `MaterialDetail`
- [x] `schemas.ts` — `MaterialSchema` thêm `conversions: v.array(MaterialConversionSchema)`
- [x] `services.ts` — `useAddMaterial`/`useUpdateMaterial` gửi `conversions`; thêm `useGetMaterial(id)` detail hook
- [x] `endpoints.ts` — thêm `materials.detail(id)`

### Frontend UI (app/(app)/materials)

- [x] `create-dialog.tsx` — thêm `MaterialConversionSection` conditional (watch `unitId` → `conversionType`)
- [x] `edit-dialog.tsx` — prefill `conversions` từ `useGetMaterial(id)`, thêm `MaterialConversionSection`
- [x] `conversion-section.tsx` (mới) — `FieldArray` + `insert`/`remove` + `SelectField` toUnit + `InputField` factor
