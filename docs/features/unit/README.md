# Unit (Đơn vị tính) — Index

> **v1.4** — Đang thiết kế UnitConversion
> Feature folder: `src/features/unit/`
> Backend entity: [`material`](../../../con-wms/docs/entities/material/README.md)

## Tài liệu

| File | Nội dung |
|---|---|
| [`data-model.md`](data-model.md) | TypeScript types — `Unit` (phẳng, không tree) |
| [`api-spec.md`](api-spec.md) | API endpoints consumed, request/response spec |
| [`implementation.md`](implementation.md) | Checklist triển khai từng bước |
| [`page-design.md`](page-design.md) | Thiết kế UI: mockup, component tree, state flow |
| [`conversion-data-model.md`](conversion-data-model.md) | 🔵 UnitConversion: types, schemas, API spec |
| [`conversion-page-design.md`](conversion-page-design.md) | 🔵 UnitConversion: UI design (detail dialog) |
| [`change-log.md`](change-log.md) | Lịch sử thay đổi thiết kế |

## Scope

| Thành phần | Mô tả | Trạng thái |
|---|---|---|
| Types | `Unit` — `{ id, code, name, isActive }` | ✅ Hoàn thành |
| Schemas | `UnitSchema` — code + name validation | ✅ Hoàn thành |
| Services | useGetUnits, useAddUnit, useUpdateUnit, useDeleteUnit | ✅ Hoàn thành |
| UI | Table phẳng + create/edit/delete dialogs | ✅ Hoàn thành |
| UnitConversion | Quy đổi đơn vị trong Detail Dialog | 🔵 Đang thiết kế |

## Trạng thái tổng thể

🔵 **Đang thiết kế UnitConversion** — Data layer + UI gốc ✅, chờ duyệt thiết kế conversion
