# Unit (Đơn vị tính) — Index

> **v2.0** — Hoàn thành UnitConversion (toàn cục)
> Feature folder: `src/features/unit/`
> Backend entity: [`material`](../../../con-wms/docs/entities/material/README.md)

## Tài liệu

| File | Nội dung |
|---|---|
| [`data-model.md`](data-model.md) | TypeScript types — `Unit` (phẳng, không tree) |
| [`api-spec.md`](api-spec.md) | API endpoints consumed, request/response spec |
| [`implementation.md`](implementation.md) | Checklist triển khai từng bước |
| [`page-design.md`](page-design.md) | Thiết kế UI: mockup, component tree, state flow |
| [`conversion-data-model.md`](conversion-data-model.md) | UnitConversion: types, API spec (toàn cục) |
| [`conversion-page-design.md`](conversion-page-design.md) | UnitConversion: UI design (tích hợp Edit Dialog) |
| [`change-log.md`](change-log.md) | Lịch sử thay đổi thiết kế |

## Scope

| Thành phần | Mô tả | Trạng thái |
|---|---|---|
| Types | `Unit` — `{ id, code, name, isActive }` | ✅ Hoàn thành |
| Schemas | `UnitSchema` — code + name validation | ✅ Hoàn thành |
| Services | useGetUnits, useAddUnit, useUpdateUnit, useDeleteUnit | ✅ Hoàn thành |
| UI | Table phẳng + create/edit/delete dialogs | ✅ Hoàn thành |
| UnitConversion | Data layer + UI (quy đổi toàn cục trong Edit Dialog) | ✅ Hoàn thành |

## Đặc điểm

- **Dữ liệu phẳng** (không tree)
- ≤ 20 items, không pagination
- Update dùng PATCH
- **Quy đổi toàn cục** quản lý ngay trong Edit Unit Dialog
- Quy đổi theo vật tư: backlog (chờ Material feature)

## Trạng thái tổng thể

✅ **Hoàn thành** — Data layer + UI + UnitConversion
