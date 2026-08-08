# Change Log — Material Category

## v1.3 — 2026-08-07
- **Edit dialog**: `useUpdateCategory()` wrapper dùng `usePartialUpdate`. Dialog tự quản lý `open`, clean up qua `onOpenChangeComplete`. Form pre-fill qua child component mount pattern.
- **Delete**: `useDeleteCategory()` + `DeleteConfirmDialog` component. Endpoint config hỗ trợ dynamic URL `update(id)`, `delete(id)`.
- **Shared components**: `SelectField` (Formisch integration, `renderOption`/`renderValue`), `usePartialUpdate` (partial schema, dirty tracking, cache invalidate).

## v1.2 — 2026-08-07
- **types.ts**: + `description: string`; giảm `MaterialCategoryColor` 22 → 10 màu.
- **utils.ts**: Giảm `CATEGORY_COLOR_MAP` 22 → 10 màu. Runtime code tách khỏi types.ts.
- **schemas.ts**: `CategorySchema` (code, name, description, color, parentId).
- **services.ts**: + `useAddCategory()` via `usePost`. + `useUpdateCategory()` via `usePartialUpdate`. + `useDeleteCategory()` via `useMutation`.
- **endpoints.ts**: + `categories.create`, `update`, `delete` (dynamic URLs).
- **UI**: Create dialog + Edit dialog với `DeleteConfirmDialog`.

## v1.1 — 2026-08-07
- Bỏ `FlatRow<T>`, dùng TanStack Table native `getSubRows` cho tree.
- Search/filter client-side qua `useMemo`.

## v1.0 — 2026-08-07
Khởi tạo data layer + UI hiển thị cơ bản.
