# Change Log — Material Category

## v1.2 — 2026-08-07

- **types.ts**: + `description: string` vào `MaterialCategory`; giảm `MaterialCategoryColor` 22 → 10 màu.
- **utils.ts**: Giảm `CATEGORY_COLOR_MAP` 22 → 10 màu.
- **schemas.ts**: Mới `CreateCategorySchema` (code, name, description, color, parentId).
- **services.ts**: + `useAddCategory()` mutation via `usePost`.
- **endpoints.ts**: + `categories.create`.
- **UI plan**: Create dialog với SelectField (parent + color). SelectField là component mới trong `@/components/form/`.
- **D8-D11**: Quyết định thiết kế mới cho form UI.

## v1.1 — 2026-08-07

- Bỏ `FlatRow<T>`, dùng TanStack Table native `getSubRows` cho tree.
- Search/filter client-side qua `useMemo`.

## v1.0 — 2026-08-07

Khởi tạo data layer + UI hiển thị:

- **Types:** `MaterialCategory` (tree), `FlatCategory`, `MaterialCategoryColor` (22 màu), `CATEGORY_COLOR_MAP`, `getCategoryColorClass()`.
- **Services:** `useGetCategories()`.
- **Config:** `authEndpoints.categories.list`, `categoryKeys`.
- **UI:** TanStack Table tree, search filter, DataTable column sizing.
