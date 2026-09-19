# Page Design — Outbound Note (Phiếu Xuất)

> Status: 🔵 Đang thiết kế
> Data layer: ✅ (`src/features/outbound-note/`). Tham khảo: `src/app/(app)/notes/inbound/` (table + dialogs + _components), `docs/features/inbound-note/page-design.md`
> Cấu trúc notes: `src/app/(app)/notes/layout.tsx` bọc `NoteTypeTabs` → các route con `notes/inbound`, `notes/outbound`, `notes/stocktake` share layout. Header của từng page nhúng `NoteStatusTabs`.

## 1. Phạm vi

| # | Thành phần | Loại | Route |
|---|------------|------|-------|
| P1 | Danh sách phiếu xuất | `table` phân trang + expand lines | `/(app)/notes/outbound` |
| P2 | Tạo phiếu (nháp) | form dialog max-w-3xl | — |
| P3 | Sửa phiếu nháp (replace-all) | form dialog | — |
| P4 | Chốt phiếu | ConfirmDialog | — |
| P5 | Hủy phiếu (lý do) | dialog + VoidNoteSchema | — |
| P6 | Xóa nháp | DeleteConfirmDialog | — |
| P7 | Detail expand / dialog | read-only | — |

Vòng đời: `draft → posted → voided` — giống inbound.

## 2. P1 — Danh sách `/notes/outbound`

### 2.1 Mockup

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ [Tất cả | Phiếu nhập | Phiếu xuất | Kiểm kê]                                             │ ← NoteTypeTabs (layout)
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ [Nháp | Đã chốt | Đã hủy]  64 phiếu                                  [+ Tạo phiếu xuất] │ ← header + NoteStatusTabs
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ [Loại: Tất cả ▾] [Kho xuất: Tất cả ▾] [Kho đích: Tất cả ▾] [Công trường: Tất cả ▾]      │
│ [Từ: __/__/____] [Đến: __/__/____]                    [🔍 Tìm số phiếu/ghi chú…]        │ ← filter-bar
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ Số phiếu       Ngày       Loại              Trạng thái  Kho xuất   Đích/Công trường  SL   Người lập   │
│ PX-20260818-001 18/08/2026 Xuất cấp         [Nháp]     Kho chính  CT_RG             2    thukho@…  ⋮ │
│ PX-20260818-002 18/08/2026 Điều chuyển      [Đã chốt]  Kho chính  Kho phụ           1    thukho@…  ⋮ │
│ ▸ expand: Vật tư | Số lượng | Ghi chú                                                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ ← 1 2 3 →                                                                                │ ← footer pagination
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Columns

| Column | accessor | size |
|--------|----------|------|
| Số phiếu | number | 170/140 mono |
| Ngày | date | 100/90 |
| Loại | noteTypeLabel | 130/100 |
| Trạng thái | statusLabel + Badge getNoteStatusColorClass | 110/90 |
| Kho xuất | warehouse.name | 150/110 |
| Đích | toWarehouse?.name / site?.name (render theo noteType) | 180/120 |
| SL dòng | totalQuantity | 90/80 right |
| Người lập | createdBy.email | 160/110 |
| Actions | Dropdown ⋮ (sửa/xóa khi draft, chốt khi draft, hủy khi posted, xem) | 60 |

### 2.3 Component tree + state flow

```
NotesLayout (layout.tsx)
 └── NoteTypeTabs (enable outbound khi triển khai)
      └── OutboundNotesPage (page.tsx) — flex min-h-0 flex-1 flex-col
          ├── useOutboundNoteParams() — {status, noteType, warehouse, toWarehouse, site, dateFrom, dateTo, search, page}
          ├── useGetOutboundNotes(params) — Paginated<OutboundNote>
          ├── state: createOpen | editingNoteId | voidingNote | finalizingNote | deleteTarget
          ├── OutboundNotesHeader {total, onAdd, status, onStatusChange} — chứa NoteStatusTabs
          ├── OutboundNotesFilterBar {noteType, warehouse, toWarehouse, site, dateFrom/To, search}
          ├── OutboundNotesTableSection {table, isRefreshing, renderExpandedRow → DetailExpanded}
          ├── OutboundNotesFooter (pagination server-side)
          ├── CreateOutboundNoteDialog
          ├── EditOutboundNoteDialog (noteId → useGetOutboundNote)
          ├── VoidOutboundNoteDialog
          ├── ConfirmDialog (finalize)
          └── DeleteConfirmDialog (delete draft)
```

Tuân thủ `src/app/(app)/notes/inbound/page.tsx:68` (getRowCanExpand, keepPreviousData, isFetching/isPlaceholderData).

### 2.4 Files

```
src/app/(app)/notes/outbound/
├── page.tsx
├── header.tsx
├── filter-bar.tsx
├── columns.tsx
├── table-section.tsx
├── footer.tsx
├── use-outbound-note-params.ts
├── create-dialog.tsx
├── edit-dialog.tsx
├── detail-expanded.tsx
├── void-dialog.tsx
└── note-form.tsx  ← share create/edit (radio noteType → conditional site/toWarehouse + lines editor)
```

## 3. P2/P3 — Create/Edit form

Reuse pattern `inbound/note-form.tsx:147`:
- Radio `noteType`: `issue_for_use` hiện `SiteSelectField` (siteId*), ẩn `toWarehouse`; `transfer` ngược lại.
- Kho xuất: `WarehouseSelectField`
- Lines: `FormField ["lines"]` map → `MaterialSelectField` + `InputField quantity` + `InputField note` + remove; `+ Thêm dòng` → insert.
- Totals: Σ quantity live.
- Create: `useAddOutboundNote` (initialInput noteType=issue_for_use, date=today). Edit: `useUpdateOutboundNote(id, toOutboundNoteInput(detail))` full PUT replace-all, pre-fill child mount.

## 4. P4/P5 — Chốt/Hủy

- Chốt: `ConfirmDialog` title "Chốt phiếu" — warning không sửa/xóa sau chốt, tồn sẽ trừ ngay + chặn tồn âm.
- Hủy: `VoidOutboundNoteDialog` dùng `useVoidOutboundNote(id)` + `VoidNoteSchema` (reason*), mô tả đảo dấu cho cả 2 đầu nếu điều chuyển.

## 5. Enable tabs

- `src/app/(app)/notes/_components/note-type-tabs.tsx:35` → `outbound.enabled = true`
- `src/app/(app)/notes/page.tsx:28` → card outbound `enabled: true`

## 6. Checklist
- [ ] Enable NoteTypeTabs + NotesPage card
- [ ] P1 table (page/header/filter/columns/table-section/footer/params)
- [ ] P2 create-dialog + note-form
- [ ] P3 edit-dialog
- [ ] detail-expanded
- [ ] void-dialog + finalize confirm + delete
