# Material Category — Index

> Feature folder: `src/features/material-category/`
> Backend entity: [`material`](../../../con-wms/docs/entities/material/README.md)
> Backend model: [`model.md`](../../../con-wms/docs/entities/material/model.md) — `MaterialCategory` (self-referential FK tree)
> Backend API: [`api.md`](../../../con-wms/docs/entities/material/api.md) — Section 2. MaterialCategory

## Tài liệu

| File                                     | Nội dung                                                                                |
| ---------------------------------------- | --------------------------------------------------------------------------------------- |
| [`data-model.md`](data-model.md)         | TypeScript interfaces, types, enums — `MaterialCategory` tree + `MaterialCategoryColor` |
| [`api-spec.md`](api-spec.md)             | API endpoints consumed, request/response spec                                           |
| [`implementation.md`](implementation.md) | Checklist triển khai từng bước                                                          |
| [`change-log.md`](change-log.md)         | Lịch sử thay đổi thiết kế                                                               |

## Scope

| Thành phần | Mô tả                                                                 | Trạng thái       |
| ---------- | --------------------------------------------------------------------- | ---------------- |
| Types      | `MaterialCategory` (tree), `MaterialCategoryColor` (union), color map | 🔵 Đang thiết kế |
| Schemas    | Chưa có (chưa làm POST/PUT)                                           | ⏸️ Deferred      |
| Services   | `useGetCategories()` — GET list dạng tree                             | 🔵 Đang thiết kế |

## Trạng thái tổng thể

🔵 **Đang thiết kế** — Chưa code
