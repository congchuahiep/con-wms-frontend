# Change Log — Notes (Chứng từ kho)

## 2026-09-20 — v0.3 — Search sống trên URL `?search=`

- **Hook chung mới** `src/hooks/use-url-search-param.ts`: đồng bộ giá trị search với query param — đọc từ `?search=` (URL là nguồn sự thật), gõ xong debounce 300ms commit bằng `router.replace` (giữ các param khác, bỏ `page`, không spam lịch sử). URL đổi từ ngoài (back/forward, link từ sổ kho) tự đổ vào ô nhập.
- Áp vào 3 trang: `use-inbound-note-params.ts`, `use-outbound-note-params.ts`, `use-stocktake-note-params.ts` — bỏ state `search` + `debouncedSearch` local, `params.search` lấy từ URL đã commit; commit search → reset về trang 1 (giống pattern reset của `status`).
- Cho phép **deep-link** lọc sẵn: `/?search=PN-20260813-001` tự điền ô tìm kiếm + lọc danh sách.

**Validation:** `biome check` ✅ + `tsc --noEmit` ✅ + `next build` ✅

## 2026-08-18 — v0.2

- **Đơn giản hoá**: bỏ shell/config/registry (`NoteListConfig`, `NoteListPage`, `features/note` data model chung).
- Chuyển sang mô hình **mỗi page độc lập**, copy cấu trúc `inbound-notes`.
- Chỉ giữ 2 component UI dùng chung: `NoteTypeTabs` + `NoteStatusTabs`.
- Không extract `NoteStatus`/color map — mỗi feature tự định nghĩa status riêng.

## 2026-08-18 — v0.1

- Khởi tạo thiết kế shell `/notes` (đã được thay bằng hướng đơn giản ở v0.2).
- Quyết định route `/notes/*`, sidebar "Chứng từ kho", giữ status khi đổi type, hub pha 1 không stats.
