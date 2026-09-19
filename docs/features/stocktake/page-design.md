# Page Design — Stocktake Note (Phiếu Kiểm Kê)

> Status: 🔵 Đang thiết kế
> Data layer: ✅ (`src/features/stocktake/`). Tham khảo: `notes/inbound/page-design.md`, `notes/layout.tsx` + `_components/note-type-tabs.tsx`

## 1. Phạm vi

| # | Thành phần | Loại | Route |
|---|------------|------|-------|
| P1 | Danh sách phiếu kiểm kê | `table` phân trang + expand | `/(app)/notes/stocktake` |
| P2 | Tạo phiếu (chênh lệch) | form dialog | — |
| P3 | Sửa phiếu nháp | form dialog | — |
| P4 | Chốt (ghi điều chỉnh tồn) | ConfirmDialog | — |
| P5 | Hủy (đảo dấu) | dialog reason | — |
| P6 | Xóa nháp | DeleteConfirmDialog | — |

Phiếu chỉ chứa `difference`+`reason`, không có noteType. Tồn đối chiếu lấy động từ `/api/stock/?warehouse=X` (client).

## 2. P1 — Danh sách

### 2.1 Mockup

```
┌──────────────────────────────────────────────────────────────────────┐
│ [Tất cả | Phiếu nhập | Phiếu xuất | Kiểm kê]                          │ ← NoteTypeTabs
├──────────────────────────────────────────────────────────────────────┤
│ [Nháp | Đã chốt | Đã hủy]  12 phiếu                [+ Tạo phiếu kiểm kê]│
├──────────────────────────────────────────────────────────────────────┤
│ [Kho: Tất cả ▾] [Từ: __/__/____] [Đến: __/__/____] [🔍 Tìm số phiếu…] │
├──────────────────────────────────────────────────────────────────────┤
│ Số phiếu       Ngày       Kho        SL điều chỉnh  Trạng thái Người lập │
│ PK-20260818-001 18/08/2026 Kho chính  2            [Nháp]    thukho@… ⋮ │
│ ▸ expand: Vật tư | Chênh lệch ± | Lý do                               │
├──────────────────────────────────────────────────────────────────────┤
│ ← 1 2 →                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.2 Columns

| Column | size |
|--------|------|
| Số phiếu | 170/140 mono |
| Ngày | 100/90 |
| Kho | 150/110 |
| SL dòng | 90/80 |
| Trạng thái | 110/90 Badge |
| Người lập | 160/110 |
| Actions | 60 |

Expand row: bảng lines `material.code/name | difference (màu đỏ âm/xanh dương) | reason`.

### 2.3 Component tree

```
NotesLayout
 └── StocktakeNotesPage
     ├── useStocktakeNoteParams (status, warehouse, dateFrom/To, search, page)
     ├── useGetStocktakeNotes(params)
     ├── state: createOpen | editingId | voidingNote | finalizingNote | deleteTarget
     ├── StocktakeHeader (NoteStatusTabs inside)
     ├── StocktakeFilterBar
     ├── StocktakeTableSection (expand)
     ├── StocktakeFooter
     ├── CreateStocktakeDialog (StocktakeNoteSchema)
     ├── EditStocktakeDialog
     ├── VoidDialog
     ├── ConfirmDialog (finalize — note chặn tồn âm)
     └── DeleteConfirmDialog
```

### 2.4 Files

```
src/app/(app)/notes/stocktake/
├── page.tsx
├── header.tsx
├── filter-bar.tsx
├── columns.tsx
├── table-section.tsx
├── footer.tsx
├── use-stocktake-note-params.ts
├── create-dialog.tsx
├── edit-dialog.tsx
├── detail-expanded.tsx
├── void-dialog.tsx
└── note-form.tsx
```

## 3. P2/P3 — Form

- Fields: date*, warehouseId*, note, lines*: mỗi dòng `materialId*`, `difference*` (±, ≠0), `reason*` (bắt buộc), `note`.
- Stock reference: trong dialog hiển thị banner "Tồn hiện tại (động) — lấy từ /api/stock/?warehouse=X" để thủ kho đối chiếu (không lưu book_quantity).
- Lines editor: same inbound pattern (insert/remove + MaterialSelectField).
- Create: `useAddStocktakeNote`, Edit: `useUpdateStocktakeNote` PUT replace-all.

## 4. Checklist
- [ ] Enable tabs/card cho stocktake
- [ ] P1 table
- [ ] P2/P3 form dialogs
- [ ] detail-expanded + void + finalize/delete
