# Unit (Đơn vị tính) — Index

> Feature folder: `src/features/unit/`
> Backend entity: [`material`](../../../con-wms/docs/entities/material/README.md)
> Backend API: [`api.md`](../../../con-wms/docs/entities/material/api.md) — Section 3. Unit

## Tài liệu

| File                                     | Nội dung                                                  |
| ---------------------------------------- | --------------------------------------------------------- |
| [`data-model.md`](data-model.md)         | TypeScript types — `Unit` (phẳng, không tree)             |
| [`api-spec.md`](api-spec.md)             | API endpoints consumed, request/response spec             |
| [`implementation.md`](implementation.md) | Checklist triển khai từng bước                            |
| [`change-log.md`](change-log.md)         | Lịch sử thay đổi thiết kế                                 |

## Scope

| Thành phần | Mô tả                                          | Trạng thái       |
| ---------- | ---------------------------------------------- | ---------------- |
| Types      | `Unit` — `{ id, code, name, isActive }`        | 🔵 Đang thiết kế |
| Schemas    | `UnitSchema` — code + name validation          | 🔵 Đang thiết kế |
| Services   | useGetUnits, useAddUnit, useUpdateUnit, useDeleteUnit | 🔵 Đang thiết kế |
| UI         | Table phẳng + create/edit/delete dialogs        | 🔵 Đang thiết kế |

## Đặc điểm

- **Dữ liệu phẳng** (không tree như Material Category)
- ≤ 20 items, không pagination
- Chỉ 2 field: `code` + `name`
- Permission: GET = IsAuthenticated, POST/PUT/DELETE = IsAdminOrStorekeeper

## Trạng thái tổng thể

🔵 **Đang thiết kế** — Chưa code
