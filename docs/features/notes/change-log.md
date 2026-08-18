# Change Log — Notes (Chứng từ kho)

## 2026-08-18 — v0.2

- **Đơn giản hoá**: bỏ shell/config/registry (`NoteListConfig`, `NoteListPage`, `features/note` data model chung).
- Chuyển sang mô hình **mỗi page độc lập**, copy cấu trúc `inbound-notes`.
- Chỉ giữ 2 component UI dùng chung: `NoteTypeTabs` + `NoteStatusTabs`.
- Không extract `NoteStatus`/color map — mỗi feature tự định nghĩa status riêng.

## 2026-08-18 — v0.1

- Khởi tạo thiết kế shell `/notes` (đã được thay bằng hướng đơn giản ở v0.2).
- Quyết định route `/notes/*`, sidebar "Chứng từ kho", giữ status khi đổi type, hub pha 1 không stats.
