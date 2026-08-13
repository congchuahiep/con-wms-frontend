# Change Log — Supplier

## v1.0 — 2026-08-13

Triển khai hoàn tất:

- ✅ Data layer: `types.ts`, `schemas.ts`, `services.ts`, `index.ts`
- ✅ Config: `endpoints.ts` (`suppliers.*`), `querykeys.ts` (`supplierKeys`)
- ✅ UI: page table (`header`, `filter-bar`, `columns`, `table-section`, `footer`, `use-supplier-params`)
- ✅ Create/edit dialog (`useAddSupplier`, `useUpdateSupplier`)
- ✅ Delete (soft delete) + sidebar nav item

### Kết quả validate

| Check | Kết quả |
|---|---|
| Diagnostics (TS language server) | ✅ Không lỗi/warning trên các file mới |
| Biome check | ✅ Pass (không còn fix) |

## v0.1 — 2026-08-13

Khởi tạo thiết kế ban đầu:

- 8 field form (`code`, `name`, `taxCode`, `contactPerson`, `phone`, `email`, `address`, `note`)
- `isActive` chỉ đọc trong type, không nằm trong schema (soft delete qua DELETE)
- List trả về mảng phẳng `Supplier[]` (backend `pagination_class = None`)
- Search server-side qua `?search=` (SearchFilter trên `code` + `name`)
- Edit pre-fill trực tiếp từ row, không cần fetch detail
- Update dùng `PATCH` + `usePartialUpdate`

### Kết quả validate library

| Library | Kết quả |
|---|---|
| Valibot 1.4.2 | ✅ `v.pipe`, `v.nonEmpty`, `v.regex`, `v.maxLength`, `v.optional`, `v.union`, `v.literal`, `v.email` |
| TanStack Query 5.101.4 | ✅ `useQuery`, `useMutation`, `useQueryClient` |
| Hooks project | ✅ `usePost`, `usePartialUpdate` |
