# Change Log — Unit

## v1.3 — 2026-08-08

- **UI hoàn thành:** 8 file page (`header`, `filter-bar`, `columns`, `table-section`, `footer`, `create-dialog`, `edit-dialog`, `page.tsx`)
- Pattern từ Material Category, đơn giản hóa (bỏ tree, bỏ SelectField, bỏ color)
- Delete dùng `DeleteConfirmDialog`
- Search client-side filter mảng phẳng
- Edit dialog: `onOpenChangeComplete` + child `EditUnitFormContent` mount khi có data

## v1.2 — 2026-08-08

- **PATCH (không PUT):** Cập nhật dùng `authApi.patch()` + `usePartialUpdate` — nhất quán convention toàn dự án
- API spec: `PUT` → `PATCH`, thêm ghi chú về convention
- Cập nhật skill `feature-design` — thêm convention PATCH

## v1.1 — 2026-08-08

- **Sửa schema validation** dựa trên Django model thực tế:
  - `code`: `maxLength` 50 → **10** (khớp `max_length=10`)
  - `name`: `maxLength` 200 → **100** (khớp `max_length=100`)
- **Bổ sung D4-D10**: Quyết định thiết kế mới (xem data-model.md)
- **API spec**: Cập nhật response mẫu với `created_at`/`updated_at`, ghi chú frontend bỏ 2 field này

## v1.0 — 2026-08-08

**Context7 validate:** Valibot `v.pipe(v.string(), v.nonEmpty(), v.maxLength())` pattern confirmed.

Khởi tạo thiết kế data layer + UI:

- **Types:** `Unit` — `{ id, code, name, isActive }`
- **Schemas:** `UnitSchema` — code + name validation với `v.pipe()`
- **Services:** useGetUnits (useQuery), useAddUnit (usePost), useUpdateUnit (usePartialUpdate), useDeleteUnit (useMutation)
- **Config:** `authEndpoints.units`, `unitKeys`
- **UI:** Table phẳng, search client-side, create/edit/delete dialogs
