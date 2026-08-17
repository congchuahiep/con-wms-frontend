# Page Design — Inbound Note (Phiếu Nhập)

> **Status:** 🔵 Đang thiết kế — chờ user duyệt trước khi code.
> Data layer: ✅ đã có (`src/features/inbound-note/`). Page tham khảo: `src/app/(app)/materials/` (table + dialogs), `src/app/(app)/material-categories/` (dialog animation pattern).

## 1. Phạm vi

| # | Thành phần | Loại | Trạng thái |
|---|---|---|---|
| P1 | Trang danh sách phiếu nhập `/inbound-notes` | `table` (server-side filter + phân trang) | Mới |
| P2 | Create dialog — tạo phiếu nháp + dòng (nested write) | `form` (dialog lớn) | Mới |
| P3 | Edit dialog — sửa phiếu nháp (replace-all) | `form` (dialog lớn) | Mới |
| P4 | Detail dialog — xem chi tiết phiếu + lines (read-only) | dialog | Mới |
| P5 | Chốt phiếu — confirm | `ConfirmDialog` (mới, generic) | Mới |
| P6 | Hủy phiếu — bắt buộc lý do | dialog + form (`VoidNoteSchema`) | Mới |

Sidebar: thêm mục **"Phiếu nhập"** (`/inbound-notes`) vào nhóm *Nghiệp vụ* (trên "Báo cáo").

---

## 2. P1 — Trang danh sách `/inbound-notes`

### 2.1 Phân tích UX

- **Ai dùng:** thủ kho — tạo phiếu (quét barcode), chốt/hủy; kế toán — xem lịch sử giao dịch NCC.
- **Primary action:** **Tạo phiếu nhập** → CreateDialog.
- **Vòng đời hành động theo `status`:**

| Status | Xem | Sửa | Xóa | Chốt | Hủy |
|---|---|---|---|---|---|
| `draft` | ✅ DetailDialog | ✅ EditDialog | ✅ DeleteConfirmDialog | ✅ ConfirmDialog | — |
| `posted` | ✅ DetailDialog | — | — | — | ✅ VoidDialog |
| `voided` | ✅ DetailDialog | — | — | — | — |

### 2.2 Mockup

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ [▣] Phiếu nhập   64 phiếu                                            [+ Tạo phiếu nhập]      │ ← header
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ [Trạng thái: Tất cả ▾] [Loại: Tất cả ▾] [🏢 Kho: Tất cả ▾] [🚚 NCC: Tất cả ▾]                 │
│ [Từ: 01/08/2026] [Đến: 31/08/2026]                          [🔍 Tìm số phiếu…]              │ ← filter bar
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ Số phiếu          Ngày        Loại                            Trạng thái   Kho        NCC        SL      Thành tiền  Người lập    │
│ PN-20260813-001   13/08/2026  Nhập mua                        [Đã chốt]    Kho chính  ABC…       105.500 10.725.000  thukho@…   ⋮ │
│ PN-20260813-002   13/08/2026  Nhập hàng công trường trả lại   [Nháp]      Kho phụ    —          2.000   1.000.000   thukho@…   ⋮ │
│ PN-20260812-008   12/08/2026  Nhập mua                        [Đã hủy]     Kho chính  ABC…       50.000  4.400.000   thukho@…   ⋮ │
│ …                                                                                              │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ ← 1 2 3 →                                                                                     │ ← footer pagination
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Columns

| Column | Accessor | Render | Size/minSize |
|---|---|---|---|
| Số phiếu | `number` | font-mono, font-medium | 170/140 |
| Ngày | `date` | `dd/mm/yyyy` | 100/90 |
| Loại | `noteType` | text: `noteTypeLabel` (backend trả sẵn — đừng hardcode label); `return_from_site` → icon ↺ | 130/100 |
| Trạng thái | `status` | Badge `getNoteStatusColorClass` + `statusLabel` | 110/90 |
| Kho | `warehouse.name` | muted | 150/110 |
| NCC | `supplier?.name` | `"—"` null | 180/120 |
| Số lượng | `totalQuantity` | right tabular | 100/80 |
| Thành tiền | `totalAmount` | right tabular, font-medium | 130/100 |
| Người lập | `createdBy.email` | muted | 160/110 |
| Actions | — | `DropdownMenu` ⋮ (items theo status — bảng §2.1) | flexible, minSize 60 |

### 2.4 Component tree + state flow

```
InboundNotesPage (page.tsx)
├── useInboundNoteParams()                 ← { params, setStatus, setNoteType, setWarehouse, setSupplier,
│                                             setDateFrom, setDateTo, setSearch, setPage }
├── useGetInboundNotes(params)             ← Paginated<InboundNote>
├── state: dialogOpen | editingNote | viewingNote | voidingNote | finalizingNote | deleteTarget
├── useDeleteInboundNote() / useFinalizeInboundNote(id) / …
├── <InboundNotesHeader total={meta.total} onAdd />
├── <InboundNotesFilterBar … />
├── <InboundNotesTableSection table />
├── <InboundNotesFooter … />               ← DataTablePagination (server-side)
└── Dialogs:
    ├── <CreateInboundNoteDialog open onOpenChange />
    ├── <EditInboundNoteDialog note={editingNote} onClose />       ← chỉ khi note && status=draft
    ├── <InboundNoteDetailDialog noteId={viewingNote?.id} onClose />
    ├── <VoidInboundNoteDialog note={voidingNote} onClose />
    ├── <ConfirmDialog open … title="Chốt phiếu" onConfirm={finalize.mutateAsync} />   ← chốt
    └── <DeleteConfirmDialog … />                                 ← xóa nháp
```

### 2.5 Files

```
src/app/(app)/inbound-notes/
├── page.tsx
├── header.tsx
├── filter-bar.tsx
├── columns.tsx
├── table-section.tsx
├── footer.tsx
├── use-inbound-note-params.ts
├── create-dialog.tsx
├── edit-dialog.tsx
├── detail-dialog.tsx
├── void-dialog.tsx
└── note-form.tsx            ← Form nội dung dùng chung create + edit (header fields + lines editor)
```

---

## 3. P2/P3 — Create/Edit dialog (form phiếu)

### 3.1 Mockup (DialogContent max-w-3xl)

```
┌─ Tạo phiếu nhập ──────────────────────────────────────────────────────────────────────────┐
│ Loại phiếu:  (●) Nhập mua   ( ) Nhập hàng công trường trả lại          Ngày: [2026-08-13]                │
│ Kho: [Chọn kho ▾] *          Nhà cung cấp: [Chọn NCC ▾] *  ← NCC chỉ hiện khi "Nhập mua"   │
│ Ghi chú: [Nhập xi măng + cát cho công trình cầu Rạch Giá____________________________]     │
│ ─────────────────────────────────────────────────────────────────────────────────────────  │
│ [🔍 Quét mã / SKU (Enter để thêm dòng)]  ← barcode HID, auto-focus                       │
│ ┌────────────────────────────────────────────────────────────────────────────────────┐   │
│ │ #  Vật tư (combobox search)     Số lượng      Đơn giá (đ)    Ghi chú          [×] │   │
│ │ 1  [XM_PCB40 — Xi măng PCB40 ▾] [100      ]   [88000      ]  [Bao 50kg      ] [🗑] │   │
│ │ 2  [CAT_XAY — Cát xây dựng ▾]   [5.5      ]   [350000     ]  [              ] [🗑] │   │
│ │ [+ Thêm dòng]                                                                       │   │
│ └────────────────────────────────────────────────────────────────────────────────────┘   │
│ Tổng SL: 105.5 · Tổng tiền: 10.725.000 đ                                                  │
│                                        [Hủy]  [Lưu phiếu nháp]                              │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Behavior

- **Barcode flow:** input "Quét mã" auto-focus. Gõ/scan mã SKU → `Enter` → tìm `useGetMaterials({search: code, pageSize: 20})` khớp chính xác `material.code`:
  - Tìm thấy + chưa có dòng → `insert(form, { path: ["lines"], initialInput: { materialId, quantity: "", unitPrice: "", note: "" } })` + focus ô Số lượng dòng mới.
  - Tìm thấy + đã có dòng → focus ô Số lượng dòng đó (tăng SL bằng tay).
  - Không tìm thấy → toast lỗi "Không tìm thấy vật tư có mã …".
- **Lines editor:** Formisch array field — mỗi dòng render bằng `FormField of={form} path={["lines", i, …]}`; thêm dòng = `insert`, xóa = `remove`. Material chọn qua `MaterialSelectField` (combobox). `quantity`/`unitPrice` là `InputField` text (schema đã validate decimal string).
- **Totals:** tính live client-side từ `lines` (Σ quantity, Σ quantity×unitPrice) — hiển thị ở footer dialog.
- **Create:** `useAddInboundNote` — success → đóng dialog + tự invalidate list/stock. **Edit:** `useUpdateInboundNote(id, toInboundNoteInput(note))` — full body replace-all; pre-fill qua `NoteForm` mount khi `note != null` (pre-fill pattern).
- **Supplier conditional:** radio loại phiếu → `return_from_site` ẩn select NCC và set `supplierId = null`; `purchase` hiện lại (2 `v.check` trong schema bắt lỗi nếu vi phạm).

### 3.3 Component tree

```
NoteForm (note-form.tsx) — dùng chung
├── <Form of={form} onSubmit>
│   ├── Loại phiếu: 2 × radio/ButtonGroup (FormField ["noteType"])
│   ├── Ngày: InputField type="date" ["date"]
│   ├── Kho: WarehouseSelectField ["warehouseId"]          ← mới (feature warehouse/components.tsx)
│   ├── NCC: SupplierSelectField ["supplierId"]            ← mới (feature supplier/components.tsx) — ẩn khi return_from_site
│   ├── Ghi chú: TextareaField ["note"]
│   ├── BarcodeInput (local state, không thuộc schema)
│   ├── LinesEditor:
│   │   └── FormField ["lines"] → map items:
│   │       ├── MaterialSelectField ["lines", i, "materialId"]
│   │       ├── InputField ["lines", i, "quantity"]
│   │       ├── InputField ["lines", i, "unitPrice"]
│   │       ├── InputField ["lines", i, "note"]
│   │       └── Button 🗑 → remove(form, { path: ["lines"], index: i })
│   │   └── Button "+ Thêm dòng" → insert(form, { path: ["lines"], initialInput: {...} })
│   └── DialogFooter: totals + Hủy + Submit
```

---

## 4. P4/P5/P6 — Detail, Chốt, Hủy

### 4.1 DetailDialog (read-only)

Fetch `useGetInboundNote(id)` khi mở (query key detail — cache sẵn từ list nếu đã fetch). Nội dung: header info (số phiếu, ngày, loại, trạng thái badge, kho, NCC, người lập) + bảng lines (Vật tư, SL, ĐG, Thành tiền dòng, ghi chú) + tổng SL/tiền + nếu `voided`: alert hiển thị `voidReason`, `voidedBy`, `voidedAt`.

### 4.2 Chốt phiếu (P5)

`ConfirmDialog` mới (generic — trích xuất pattern từ `DeleteConfirmDialog`, thêm props `confirmLabel`, `confirmVariant: "default" | "destructive"`):

```
┌─ Chốt phiếu ─────────────────────────────┐
│ Chốt phiếu PN-20260813-001?              │
│ Sau khi chốt phiếu KHÔNG THỂ sửa/xóa —   │
│ sai sót phải hủy phiếu + lập lại.        │
│ Tồn kho sẽ tăng ngay lập tức.            │
│                [Hủy]  [Chốt phiếu]        │
└──────────────────────────────────────────┘
```

→ `useFinalizeInboundNote(id).mutateAsync()` — success → invalidate list + stock.

### 4.3 Hủy phiếu (P6)

Dialog + `Form` với `useVoidInboundNote(id)`:

```
┌─ Hủy phiếu ─────────────────────────────────────┐
│ Hủy phiếu PN-20260813-001?                       │
│ Lý do hủy * (bắt buộc):                          │
│ [Nhập sai số lượng, NCC giao thiếu____________]  │
│ Tồn kho sẽ tự trừ ngược lại.                     │
│                     [Hủy]  [Hủy phiếu (đỏ)]       │
└──────────────────────────────────────────────────┘
```

---

## 5. Components mới dùng chung

| Component | File | Ghi chú |
|---|---|---|
| `ConfirmDialog` | `src/components/ui/confirm-dialog.tsx` | Generic confirm (chốt phiếu; tái dùng sau này) |
| `MaterialSelectField` | `src/features/material/components.tsx` | Combobox search server-side (dùng chung với Sổ kho) |
| `WarehouseSelectField` | `src/features/warehouse/components.tsx` | Select + `useGetWarehouses` |
| `SupplierSelectField` | `src/features/supplier/components.tsx` | Select + `useGetSuppliers` |

## 6. Open questions

| # | Câu hỏi |
|---|---|
| Q1 | Create/Edit dùng **Dialog lớn** (max-w-3xl) như mockup — hay cần trang riêng `/inbound-notes/new`? (thủ kho quét barcode liên tục → dialog vẫn giữ context danh sách) |
| Q2 | Barcode flow: input "Quét mã" đặt trên đầu lines editor như mockup — OK? |
| Q3 | Đơn giá (unitPrice): phiếu hoàn trả (`return`) backend vẫn nhận `unitPrice` ≥ 0 — form vẫn hiện cột Đơn giá cho cả 2 loại phiếu? |
| Q4 | Detail xem trong **dialog** hay trang riêng `/inbound-notes/[id]`? |
| Q5 | Sidebar: "Phiếu nhập" đặt trên "Báo cáo" trong nhóm Nghiệp vụ — OK? |

## 7. Checklist triển khai — ✅ Hoàn thành (2026-08-13)

- [x] `ConfirmDialog` (components/ui/confirm-dialog.tsx)
- [x] `MaterialSelectField`/`MaterialCombobox`, `WarehouseSelectField`, `SupplierSelectField`
- [x] P1: `/inbound-notes` (7 files: page, header, filter-bar, columns, table-section, footer, use-params)
- [x] P2/P3: `note-form.tsx` + `create-dialog.tsx` + `edit-dialog.tsx` (lines editor qua `insert`/`remove` + `useFieldArray` keys + barcode scan)
- [x] P4/P5/P6: `detail-dialog.tsx`, `void-dialog.tsx`, chốt qua `ConfirmDialog`, xóa qua `DeleteConfirmDialog`
- [x] Sidebar: nav item "Phiếu nhập"
- [x] Typecheck + biome check + `next build` ✅
