# Implementation Checklist — Material Category

> **Phase 1:** GET hiển thị ✅ | **Phase 2:** POST/CREATE 🔵

## Phase 1 — GET (hiển thị) ✅

- [x] `src/features/material-category/types.ts` — MaterialCategory, FlatCategory, MaterialCategoryColor (10 màu), CATEGORY_COLOR_MAP
- [x] `src/features/material-category/utils.ts` — getCategoryColorClass()
- [x] `src/features/material-category/services.ts` — useGetCategories()
- [x] `src/configs/endpoints.ts` — categories.list
- [x] `src/configs/querykeys.ts` — categoryKeys
- [x] `src/features/material-category/index.ts` — barrel export
- [x] `src/app/(app)/material-categories/page.tsx` — container
- [x] `src/app/(app)/material-categories/header.tsx` — title + stats
- [x] `src/app/(app)/material-categories/filter-bar.tsx` — search
- [x] `src/app/(app)/material-categories/columns.tsx` — 3 cột + expand
- [x] `src/app/(app)/material-categories/table-section.tsx` — DataTable wrapper
- [x] `src/app/(app)/material-categories/footer.tsx` — total count
- [x] `src/components/ui/data-table.tsx` — table-fixed + column sizing

## Phase 2 — POST/CREATE 🔵

### Data layer (đã code)

- [x] `types.ts` — + `description: string`
- [x] `schemas.ts` — CreateCategorySchema (code, name, description, color, parentId)
- [x] `services.ts` — useAddCategory()
- [x] `endpoints.ts` — categories.create
- [x] `index.ts` — export schemas

### Data layer (cần sửa)

- [ ] `types.ts` — giảm MaterialCategoryColor 22 → 10 màu
- [ ] `utils.ts` — giảm CATEGORY_COLOR_MAP 22 → 10 màu

### Form infrastructure

- [ ] `src/components/form/SelectField.tsx` — **mới**, theo pattern InputField
- [ ] Props: `of`, `path`, `label`, `placeholder`, `description`, `required`, `disabled`, `options`, `transform`, `renderOption`

### UI

- [ ] `src/app/(app)/material-categories/create-dialog.tsx` — **mới**
  - Dialog + Formisch Form
  - 5 field: code, name, description, parentId, color
  - Parent select: flatten tree client-side, indent theo depth
  - Color select: 10 màu + renderOption hiển thị chấm tròn màu
- [ ] `src/app/(app)/material-categories/header.tsx` — enable nút "Thêm danh mục" + `onAdd` prop
- [ ] `src/app/(app)/material-categories/page.tsx` — + `open` state, wire CreateCategoryDialog

### Design docs

- [x] `docs/features/material-category/create-dialog.md` — mockup + component tree + state flow
- [x] `docs/features/material-category/data-model.md` — updated v1.2
- [x] `docs/features/material-category/implementation.md` — this file
- [ ] `docs/features/material-category/change-log.md` — v1.2 entry
