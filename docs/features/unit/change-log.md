# Change Log — Unit

## v1.0 — 2026-08-08

**Context7 validate:** Valibot `v.pipe(v.string(), v.nonEmpty(), v.maxLength())` pattern confirmed — khớp với usage hiện tại.

Khởi tạo thiết kế data layer + UI:

- **Types:** `Unit` — `{ id, code, name, isActive }`
- **Schemas:** `UnitSchema` — code + name validation với `v.pipe()`
- **Services:** useGetUnits (useQuery), useAddUnit (usePost), useUpdateUnit (usePartialUpdate), useDeleteUnit (useMutation)
- **Config:** `authEndpoints.units`, `unitKeys`
- **UI:** Table phẳng, search client-side, create/edit/delete dialogs
- **D1-D6:** Quyết định thiết kế (xem data-model.md)
