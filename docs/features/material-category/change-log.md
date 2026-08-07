# Change Log — Material Category

## v1.1 — 2026-08-07

- **D4 updated:** Bỏ `FlatRow<T>`, dùng TanStack Table native `getSubRows` cho tree. `row.depth` có sẵn để indent.
- **D5 added:** Search/filter client-side qua `useMemo` (≤ 30 items).

## v1.0 — 2026-08-07

Khởi tạo thiết kế data layer cho Material Category:

- **Scope:** GET list dạng tree (hiển thị). POST/PUT/DELETE deferred.
- **Types:** `MaterialCategory` (tree response), `FlatCategory` (phẳng, deferred), `MaterialCategoryColor` (union 22 màu), `CATEGORY_COLOR_MAP`, `getCategoryColorClass()`.
- **Services:** `useGetCategories()` — TanStack Query `useQuery` gọi `GET /api/categories/`.
- **Config:** `authEndpoints.categories.list`, `categoryKeys`.
- **UI plan:** TanStack Table với expand/collapse qua `getSubRows` + `enableExpanding`.
