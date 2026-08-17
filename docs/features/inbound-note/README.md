# Inbound Note (Phiếu Nhập) — Index

> Feature folder: `src/features/inbound-note/`
> Backend entity: [`inbound-note`](../../../con-wms/docs/entities/inbound-note/README.md)
> Backend API: [`api.md`](../../../con-wms/docs/entities/inbound-note/api.md)

## Tài liệu

| File                                     | Nội dung                                            |
| ---------------------------------------- | --------------------------------------------------- |
| [`data-model.md`](data-model.md)         | TypeScript types, Valibot schemas, design decisions |
| [`api-spec.md`](api-spec.md)             | API endpoints consumed, request/response spec       |
| [`implementation.md`](implementation.md) | Checklist triển khai                                |
| [`page-design.md`](page-design.md)         | Thiết kế UI: danh sách + form tạo/sửa + chốt/hủy     |
| [`change-log.md`](change-log.md)         | Lịch sử thay đổi thiết kế                           |

## Scope

| Thành phần | Mô tả                                                                       | Trạng thái       |
| ---------- | --------------------------------------------------------------------------- | ---------------- |
| Data layer | `types.ts` + `utils.ts` + `schemas.ts` + `services.ts`                      | ✅ Hoàn thành    |
| Endpoints  | `inboundNotes.list/create/detail/update/delete/post/void`                   | ✅ Hoàn thành    |
| Query keys | `inboundNoteKeys`                                                           | ✅ Hoàn thành    |
| UI         | Page danh sách + form tạo/sửa phiếu + dialog hủy (`/inbound-notes`) | ✅ Hoàn thành    |

## Trạng thái tổng thể

✅ **Hoàn thành** — data layer + UI (danh sách, tạo/sửa, chốt/hủy, xem chi tiết)

## Đặc điểm

- **Nested write**: tạo/sửa phiếu gửi 1 request duy nhất chứa phiếu + `lines[]` (backend `transaction.atomic`, D9).
- **Vòng đời `draft → posted → voided`**: phiếu đã chốt **bất biến** — sửa/xóa chỉ khi `draft`; chốt = `POST /{id}/post/`, hủy = `POST /{id}/void/` (bắt buộc lý do).
- **PUT replace-all**: sửa phiếu nháp gửi **full body** (dòng cũ bị xóa thay bằng `lines` mới) — khác convention PATCH dirty-tracking của repo (xem D4).
- **Chốt/hủy ảnh hưởng tồn kho**: mọi mutation phải invalidate cả `inboundNoteKeys` **và** `stockKeys` (sổ kho + tồn kho đổi khi chốt/hủy).
