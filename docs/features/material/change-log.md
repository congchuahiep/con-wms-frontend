# Change Log — Material

## v1.1 — 2026-08-12

- **Refactor types**: Dùng `Paginated<T>` generic từ `src/types.ts` thay vì `MaterialListResponse` + `PaginatedMeta` riêng
- **Refactor nested refs**: `CategoryRef` → `SimpleMaterialCategory` (đặt tại `material-category/types.ts`), `UnitRef` → `SimpleUnit` (đã có sẵn trong `unit/types.ts`)
- **Prerequisites**: Thêm `Paginated<T>` vào `src/types.ts`, thêm `SimpleMaterialCategory` vào `material-category/types.ts`

## v1.0 — 2026-08-11

### Khởi tạo thiết kế data layer

- **types.ts**: `Material`, `CategoryRef`, `UnitRef`, `MaterialListResponse`, `PaginatedMeta`
- **schemas.ts**: `MaterialSchema` cho POST/PATCH body
- **services.ts**: `useGetMaterials()`, `useAddMaterial()`, `useUpdateMaterial()`, `useDeleteMaterial()`
- **endpoints.ts**: `materials.list`, `create`, `update(id)`, `delete(id)`
- **querykeys.ts**: `materialKeys.all`, `list(params)`, `detail(id)`
- **Quyết định**: PATCH update, DELETE 204 → void, CategorySelectField + UnitSelectField
