# Notes (Chứng từ kho) — Index

> Route: `src/app/(app)/notes/` (hub + 3 page độc lập)
> Data layer: mỗi loại dùng feature riêng (`inbound-note` có sẵn, `outbound-note`/`stocktake-note` mới)
> Backend entities: `inbound-note` (đã có), `outbound-note` & `stocktake` (chưa thiết kế)

## Tài liệu

| File                                     | Nội dung                                    |
| ---------------------------------------- | ------------------------------------------- |
| [`data-model.md`](data-model.md)         | Nguyên tắc đơn giản + component dùng chung  |
| [`api-spec.md`](api-spec.md)             | API endpoints consumed theo từng loại phiếu |
| [`implementation.md`](implementation.md) | Checklist triển khai theo phase             |
| [`page-design.md`](page-design.md)       | Thiết kế UI: hub + page mỗi loại + tabs     |
| [`change-log.md`](change-log.md)         | Lịch sử thay đổi thiết kế                   |

## Scope

| Thành phần         | Mô tả                                            | Trạng thái          |
| ------------------ | ------------------------------------------------ | ------------------- |
| Hub `/notes`       | 3 card loại phiếu (pha 1: chưa có stats)         | 🔵 Đang thiết kế    |
| `/notes/inbound`   | Page độc lập — copy cấu trúc từ `/inbound-notes` | 🔵 Đang thiết kế    |
| `/notes/outbound`  | Page độc lập — copy cấu trúc từ `/inbound-notes` | ⏸ Phụ thuộc backend |
| `/notes/stocktake` | Page độc lập — copy cấu trúc từ `/inbound-notes` | ⏸ Phụ thuộc backend |

## Trạng thái tổng thể

🔵 **Đang thiết kế** — chờ user duyệt trước khi code.

## Quyết định thiết kế

- **Không refactor data layer**: không tạo `NoteListConfig`, `NoteListPage`, registry hay extract `NoteStatus`/color map sang module chung.
- Mỗi page `/notes/<type>` là một thư mục độc lập, giống hệt cấu trúc `src/app/(app)/inbound-notes/`.
- Chỉ dùng chung 2 component UI nhỏ: `NoteTypeTabs` (điều hướng loại) và `NoteStatusTabs` (lọc trạng thái).
- Sidebar 1 mục "Chứng từ kho" → `/notes`; giữ `/inbound-notes` cũ để đối chiếu.
