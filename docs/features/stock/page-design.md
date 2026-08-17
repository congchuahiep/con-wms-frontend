# Page Design — Stock (Tồn kho & Sổ kho)

> **Status:** 🔵 Đang thiết kế — chờ user duyệt trước khi code.
> Data layer: ✅ đã có (`src/features/stock/`). Page tham khảo: `src/app/(app)/materials/` (table + filter server-side), `src/app/(app)/inventory/` (mock sẽ thay thế).

## 1. Phạm vi

| #   | Page        | Route              | Loại                                               | Trạng thái                        |
| --- | ----------- | ------------------ | -------------------------------------------------- | --------------------------------- |
| P1  | **Tồn kho** | `/inventory`       | `table` (server-side filter, **không phân trang**) | Thay mock hiện tại bằng data thật |
| P2  | **Sổ kho**  | `/stock-movements` | `table` (server-side filter + **phân trang**)      | Mới                               |

Sidebar: thêm mục **"Sổ kho"** (`/stock-movements`) vào nhóm _Nghiệp vụ_; **"Tồn kho"** (`/inventory`) giữ nguyên.

---

## 2. P1 — Trang Tồn kho `/inventory`

### 2.1 Phân tích UX

- **Ai dùng:** thủ kho (chính) — xem tồn để biết còn bao nhiêu hàng; kế toán — đối chiếu giá trị tồn.
- **Cần làm gì:**
    - _Primary action:_ **Lập phiếu nhập** → điều hướng `/inbound-notes` (thủ kho "thêm hàng" = lập phiếu, không sửa tồn trực tiếp — stock D9).
    - _Secondary:_ lọc theo kho / danh mục / trạng thái tồn, tìm mã/tên vật tư.
- **Dữ liệu:** `useGetStockBalances(params)` — mảng phẳng `StockBalance[]` (không phân trang). Quy mô: vài trăm dòng → table client-side render + sort, filter server-side.
- **Thay đổi so với mock cũ:** bỏ tabs "Sắp hết/Còn hàng" (cần `StockAlert` — backend chưa có) → thay bằng select **"Tồn: Tất cả / Còn tồn (≠ 0)"** (`hasStock`).

### 2.2 Mockup

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [▣] Tồn kho   128 dòng tồn kho · 3 kho          [⤓ Xuất CSV]  [+ Lập phiếu nhập]│ ← header
├──────────────────────────────────────────────────────────────────────────────┤
│ [🏷 Danh mục: Tất cả ▾] [🏢 Kho: Tất cả kho ▾] [Tồn: Tất cả ▾]   [🔍 Tìm mã, tên vật tư...] │ ← filter bar
├──────────────────────────────────────────────────────────────────────────────┤
│ Mã            Tên vật tư              Kho          ĐVT   Tồn kho   Giá nhập gần nhất  Giá trị tồn │
│ XM_PCB40      Xi măng PCB40           Kho chính —… BAO    85.000   88.000            7.480.000   │
│ CAT_XAY       Cát xây dựng            Kho chính —… M3     12.500   350.000           4.375.000   │
│ THEP_D10      Thép D10                Kho phụ      KG     —        —                 —           │
│ …                                                                                             │
└──────────────────────────────────────────────────────────────────────────────┘
│ 128 dòng · Tổng giá trị tồn: 1.234.567.890 đ                                    │ ← footer (không paginate)
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Columns

| Column            | Accessor            | Render                                                           | Size/minSize |
| ----------------- | ------------------- | ---------------------------------------------------------------- | ------------ |
| Mã                | `material.code`     | font-mono text-xs                                                | 120/90       |
| Tên vật tư        | `material.name`     | font-medium                                                      | 250/180      |
| Kho               | `warehouse.name`    | Badge outline                                                    | 180/120      |
| ĐVT               | `unit.code`         | muted                                                            | 80/60        |
| Tồn kho           | `quantity`          | right, tabular-nums, `vi-VN` format; **đỏ khi ≤ 0**, đậm khi > 0 | 100/80       |
| Giá nhập gần nhất | `lastPurchasePrice` | right, tabular; `"—"` khi null                                   | 140/110      |
| Giá trị tồn       | `stockValue`        | right, tabular, font-medium; `"—"` khi null                      | 160/120      |

> Không có cột "Danh mục" — `StockBalance` không trả về category.

### 2.4 Component tree + state flow

```
InventoryPage (page.tsx)
├── useStockParams()                      ← { params, setSearch, setWarehouse, setCategory, setStockStatus }
├── useGetStockBalances(params)           ← StockBalance[]
├── state: table (useReactTable, data = items, client-side sort)
├── <InventoryHeader totalRows={items.length} totalValue={sum(stockValue)} />
├── <InventoryFilterBar … />              ← Selects (useGetWarehouses, useGetCategories) + search
├── <InventoryTableSection table />
└── <InventoryFooter totalRows totalValue />   ← KHÔNG dùng DataTablePagination (mảng phẳng)
```

### 2.5 Components

| Loại                    | Component                                          | Nguồn                              |
| ----------------------- | -------------------------------------------------- | ---------------------------------- |
| Header + actions        | `InventoryHeader` (sửa từ mock)                    | local                              |
| Filter selects          | `Select` + `useGetWarehouses` / `useGetCategories` | `@/components/ui/select`, features |
| Search                  | `Input` + `HugeiconsIcon`                          | `@/components/ui/input`            |
| Table                   | `DataTable` + `useReactTable`                      | `@/components/ui/data-table`       |
| Button "Lập phiếu nhập" | `Button` + `Link` next/link                        | `@/components/ui/button`           |
| Empty                   | `Empty`                                            | `@/components/ui/empty`            |

### 2.6 Files

```
src/app/(app)/inventory/
├── page.tsx           ← sửa: mock → useGetStockBalances
├── header.tsx         ← sửa: stats thật + button link /inbound-notes
├── filter-bar.tsx     ← sửa: data thật + select "Tồn" (hasStock)
├── columns.tsx        ← sửa: StockBalance columns
├── table-section.tsx  ← giữ (DataTable)
├── footer.tsx         ← sửa: tổng dòng + tổng giá trị, bỏ pagination
├── tabs.tsx           ← XOÁ (thay bằng select trạng thái tồn)
└── use-stock-params.ts ← mới
```

---

## 3. P2 — Trang Sổ kho `/stock-movements`

### 3.1 Phân tích UX

- **Ai dùng:** kế toán (tra lịch sử giao dịch NCC, đối chiếu sổ), thủ kho (trace 1 phiếu).
- **Cần làm gì:** xem dòng ghi sổ theo ngày nghiệp vụ; lọc theo vật tư / kho / loại dòng / khoảng ngày; ẩn/hiện dòng hủy (reversal).
- **Dữ liệu:** `useGetStockMovements(params)` — `Paginated<StockMovement>`, pageSize mặc định 50, sắp xếp `-date, -id`.
- **Lưu ý:** backend không có `?search` cho sổ kho → lọc vật tư bằng **combobox searchable** (`MaterialSelectField`).

### 3.2 Mockup

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ [▣] Sổ kho   128 dòng ghi sổ                                                [⤓ Xuất CSV] │ ← header
├────────────────────────────────────────────────────────────────────────────────────┤
│ [🏢 Kho: Tất cả ▾] [⇄ Loại dòng: Tất cả ▾] [Từ: 01/08/2026] [Đến: 31/08/2026]         │
│ [📦 Vật tư: Chọn vật tư… ▾(combobox)]        [✓ Hiện dòng hủy (reversal)]            │ ← filter bar
├────────────────────────────────────────────────────────────────────────────────────┤
│ Ngày        Loại                                          Vật tư      Kho         Số lượng   Đơn giá  Phiếu            Người tạo     │
│ 13/08/2026  [Nhập kho: mua hàng từ nhà cung cấp]          XM_PCB40    Kho chính   +100.000   88.000   PN-20260813-001 thukho@test.com │
│ 13/08/2026  [Nhập kho: công trường trả lại hàng]          CAT_XAY     Kho phụ     +5.500     —       PN-20260813-002 thukho@test.com │
│ 12/08/2026  [Hủy phiếu*]                                  XM_PCB40    Kho chính   -100.000   —       PN-20260810-005 thukho@test.com │
│ …                                                                                              │
├────────────────────────────────────────────────────────────────────────────────────┤
│ ← 1 2 3 →                                                                           │ ← footer pagination
└────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Columns

| Column     | Accessor              | Render                                                  | Size/minSize |
| ---------- | --------------------- | ------------------------------------------------------- | ------------ |
| Ngày       | `date`                | `dd/mm/yyyy`                                            | 100/90       |
| Loại       | `movementType`        | Badge `getMovementTypeColorClass` + `movementTypeLabel` | 150/120      |
| Mã vật tư  | `material.code`       | font-mono text-xs                                       | 110/90       |
| Tên vật tư | `material.name`       | —                                                       | 200/140      |
| Kho        | `warehouse.name`      | muted                                                   | 150/110      |
| Số lượng   | `quantity`            | `formatSignedQuantity`; right tabular; + xanh / − đỏ    | 110/90       |
| Đơn giá    | `unitPrice`           | right tabular; `"—"` null                               | 120/100      |
| Phiếu      | `inboundNote?.number` | font-mono; `"—"` null                                   | 170/130      |
| Lý do      | `reason`              | truncate; badge "Hủy" khi `reversalOf != null`          | 140/100      |
| Người tạo  | `createdBy.email`     | muted                                                   | 160/110      |
| Thời điểm  | `createdAt`           | `HH:mm dd/mm`                                           | 140/110      |

### 3.4 Component tree + state flow

```
StockMovementsPage (page.tsx)
├── useStockMovementParams()               ← { params, setWarehouse, setMovementType, setMaterial,
│                                             setDateFrom, setDateTo, setOriginalsOnly, setPage }
├── useGetStockMovements(params)           ← Paginated<StockMovement> (meta.page, meta.total…)
├── <StockMovementsHeader total={meta.total} />
├── <StockMovementsFilterBar … />
├── <StockMovementsTableSection table />   ← useReactTable, data = items
└── <StockMovementsFooter … />             ← DataTablePagination (server-side, giống materials/footer)
```

### 3.5 Components

| Loại                 | Component                                      | Nguồn                                                 |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------- |
| Combobox vật tư      | `MaterialSelectField` (mới — feature material) | `@/components/ui/command` + `useGetMaterials(search)` |
| Select kho/loại dòng | `Select` + `useGetWarehouses`                  | `@/components/ui/select`                              |
| Date range           | `Input type="date"` ×2                         | `@/components/ui/input`                               |
| Toggle reversal      | `Switch` + label                               | `@/components/ui/switch`                              |
| Pagination           | `DataTablePagination`                          | `@/components/ui/data-table-pagination`               |
| Badge loại dòng      | `Badge` + `getMovementTypeColorClass`          | feature stock                                         |

### 3.6 Files

```
src/app/(app)/stock-movements/
├── page.tsx
├── header.tsx
├── filter-bar.tsx
├── columns.tsx
├── table-section.tsx
├── footer.tsx
└── use-stock-movement-params.ts
```

---

## 4. Component dùng chung (làm trong phase này)

### 4.1 `MaterialSelectField` — `src/features/material/components.tsx` (mới)

Combobox searchable (Popover + Command), search **server-side debounce 300ms** qua `useGetMaterials({ search, pageSize: 20 })`, hiển thị `"CODE - Tên"`, value = `number` (material id). Dùng ở: filter Sổ kho, form Phiếu nhập (chọn vật tư cho dòng + barcode flow).

## 5. Open questions

| #   | Câu hỏi                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------- |
| Q1  | Tồn kho bỏ tabs "Sắp hết" (backend chưa có ngưỡng cảnh báo) — đồng ý thay bằng select "Còn tồn" (`hasStock`)? |
| Q2  | Sổ kho: lọc vật tư bằng combobox searchable (backend chỉ có `?material=id`, không có `?search`) — OK?         |
| Q3  | Nút "Xuất CSV" giữ disabled (chưa có backend export) như mock cũ?                                             |
| Q4  | Sidebar: thêm "Sổ kho" ngay dưới "Tồn kho" trong nhóm Nghiệp vụ — OK?                                         |

## 6. Checklist triển khai — ✅ Hoàn thành (2026-08-13)

- [x] `MaterialSelectField` + `MaterialCombobox` (feature material/components.tsx — combobox search server-side)
- [x] P1: sửa `/inventory` (page, header, filter-bar, columns, footer, use-stock-params; **xóa `tabs.tsx`**)
- [x] P2: tạo `/stock-movements` (7 files)
- [x] Sidebar: thêm nav item "Sổ kho"
- [x] `WarehouseSelectField`, `SupplierSelectField`, `ConfirmDialog`, `src/utils/format.ts` (formatDecimal/formatDate/formatDateTime)
- [x] `stock/utils.ts` thêm `MOVEMENT_TYPE_LABELS` + `MOVEMENT_TYPES` (cho filter loại dòng)
- [x] Typecheck + biome check + `next build` ✅
