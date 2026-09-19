# Page Design — Site (Công Trường)

> Status: 🔵 Đang thiết kế — chờ duyệt
> Data layer: ✅ đã có (`src/features/site/`). Tham khảo: `src/app/(app)/suppliers/` (table), `src/app/(app)/material-categories/` (dialog animation).

## 1. Phạm vi

| # | Thành phần | Loại | Route |
|---|------------|------|-------|
| P1 | Danh sách công trường | `table` không phân trang | `/(app)/sites` hoặc `/(app)/master/sites` — hoặc giữ như warehouse/supplier top-level |
| P2 | Create dialog | form dialog | — |
| P3 | Edit dialog | form dialog | — |
| P4 | Vô hiệu hóa (soft delete) | DeleteConfirmDialog | — |

Master data — admin write, mọi role đọc.

## 2. P1 — Danh sách

### 2.1 Phân tích UX
- Ai dùng: quản lý/admin tạo công trường để phiếu xuất `issue_for_use` chọn FK.
- Primary: [+ Thêm công trường]
- Không phân trang, filter `?search=&is_active=` (default true).

### 2.2 Mockup

```
┌──────────────────────────────────────────────────────────────────────┐
│ [▣] Công trường   12 công trường                  [+ Thêm công trường] │ ← header
├──────────────────────────────────────────────────────────────────────┤
│ [🔍 Tìm mã/tên…]                                  [Trạng thái: Đang HĐ ▾] │ ← filter-bar
├──────────────────────────────────────────────────────────────────────┤
│ Mã        Tên                      Phụ trách   SĐT         Địa chỉ         Ghi chú   │
│ CT_RG     Cầu Rạch Giá             Anh Bảy     0901…       QL80…           …        ⋮ │
├──────────────────────────────────────────────────────────────────────┤
│ Tổng 12 công trường                                                    │ ← footer
└──────────────────────────────────────────────────────────────────────┘
```

### 2.3 Columns

| Column | accessor | size/minSize |
|--------|----------|--------------|
| Mã | code | 140/100 |
| Tên | name | 320/200 |
| Phụ trách | manager | 180/140 |
| SĐT | phone | 140/110 |
| Địa chỉ | address | 220/160 |
| Ghi chú | note | flexible |
| Actions | — | 80 |

### 2.4 Component tree

```
SitesPage (page.tsx)
├── useSiteParams / useGetSites(params)
├── state: dialogOpen | editingSite | deleteTarget
├── SitesHeader / SitesFilterBar / SitesTableSection / SitesFooter
├── CreateSiteDialog (useAddSite + SiteSchema)
├── EditSiteDialog (useUpdateSite — PATCH partial)
└── DeleteConfirmDialog (soft delete → is_active=false)
```

### 2.5 Files

```
src/app/(app)/sites/
├── page.tsx
├── header.tsx
├── filter-bar.tsx
├── columns.tsx
├── table-section.tsx
├── footer.tsx
├── use-site-params.ts
├── create-dialog.tsx
└── edit-dialog.tsx
```

## 3. P2/P3 — Create/Edit Dialog

Dialog `max-w-lg`, fields: code*, name*, manager, phone, address, note. Dùng `InputField`/`TextareaField` với `SiteSchema`. Edit dùng `usePartialUpdate` pattern + pre-fill child mount.

## 4. Checklist
- [ ] P1 table (page + header/filter/columns/table-section/footer/params)
- [ ] P2 create-dialog
- [ ] P3 edit-dialog
- [ ] P4 soft delete
- [ ] Sidebar nav nếu cần
