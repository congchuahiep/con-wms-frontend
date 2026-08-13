# Page Design — Material

> **Ngày:** 2026-08-12
> **Scope:** Trang danh sách vật tư — table paginated server-side, create/edit/delete
> **Page Type:** `table` (server-side pagination)
> **Data layer:** ✅ Đã hoàn thành (`src/features/material/`)
> **Tham khảo:** `material-categories/`, `units/`

---

## 1. UX Analysis

| Mục                  | Mô tả                                                                       |
| -------------------- | --------------------------------------------------------------------------- |
| **Ai dùng?**         | Admin, Thủ kho (IsAuthenticated xem, IsAdminOrStorekeeper sửa/xoá)          |
| **Primary action**   | Xem danh sách vật tư, tìm kiếm/lọc                                          |
| **Secondary action** | Thêm mới, sửa, soft delete                                                  |
| **Hiển thị**         | Table phẳng (không tree), paginated server-side                             |
| **Filter**           | Search bar (tìm mã/tên) + Category dropdown                                 |
| **Form**             | Dialog tạo mới + dialog sửa, dùng `CategorySelectField` + `UnitSelectField` |
| **Quy đổi**          | Khi unit là material-type → form Material hiển thị section quy đổi (nested)  |

---

## 2. Page Mockup

```
┌── Header ──────────────────────────────────────────────────────────┐
│ [📦] Vật tư    150 mặt hàng · 8 nhóm        (Xuất CSV) [Thêm vật tư] │
└─────────────────────────────────────────────────────────────────────┘
┌── Filter Bar ───────────────────────────────────────────────────────┐
│ [Danh mục: Tất cả ▼]              🔍 Tìm mã, tên vật tư...           │
└─────────────────────────────────────────────────────────────────────┘
┌── Table ───────────────────────────────────────────────────────────┐
│ Mã            │ Tên                     │ Danh mục    │ Đơn vị   │..│
│───────────────┼─────────────────────────┼─────────────┼──────────┼──│
│ XM-HT-PCB40   │ Xi măng Hà Tiên PCB40   │ [● Xi măng] │ BAO - Bao│..│
│ THEP-D6        │ Thép D6                 │ [● Thép]    │ KG - Kg  │..│
│ CAT-VANG       │ Cát vàng                │ [● Cát]     │ M3 - Khối│..│
│ ...                                                                 │
└─────────────────────────────────────────────────────────────────────┘
┌── Footer ───────────────────────────────────────────────────────────┐
│ 1–20 / 150                                                          │
└─────────────────────────────────────────────────────────────────────┘
```

> Cột cuối (mô tả, trạng thái) ẩn trên mobile (`hidden sm:table-cell`). Actions column: sửa (✏️), xoá (🗑️).

---

## 3. Component Tree

```
MaterialsPage (page.tsx)
├── MaterialsHeader
│   ├── Icon + Title + Stats (total items, total categories)
│   └── Buttons: (Xuất CSV) [Thêm vật tư]
├── MaterialsFilterBar
│   ├── Select (Category dropdown — từ useGetCategories)
│   └── Input (Search — tìm mã/tên)
├── MaterialsTableSection
│   └── DataTable (TanStack Table, flat, no tree)
├── MaterialsFooter
│   └── Page info: "1–20 / 150"
├── CreateMaterialDialog
│   └── Dialog + Form (useAddMaterial)
│       ├── InputField: code
│       ├── InputField: name
│       ├── CategorySelectField: categoryId
│       ├── UnitSelectField: unitId
│       ├── TextareaField: description
│       └── ConversionSection (conditional: unit.conversionType === "material")
│           ├── FieldArray of conversions
│           │   └── mỗi row: SelectField toUnitId + InputField factor + nút xoá
│           └── [+ Thêm quy đổi]
├── EditMaterialDialog
│   └── Dialog + Form (useUpdateMaterial, pre-filled)
│       ├── (same fields as create, with initial values)
│       └── ConversionSection (pre-filled từ MaterialDetail.conversions)
└── DeleteConfirmDialog
    └── Confirm delete material
```

---

## 4. State Flow

### 4.1 State Map

| State             | Vị trí (`page.tsx`)                                                     | Ghi chú                                                |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------------------------------ |
| `search`          | `useState("")`                                                          | Search input value                                     |
| `categoryFilter`  | `useState<number \| null>(null)`                                        | Category dropdown value                                |
| `page`            | `useState(1)`                                                           | Current page (reset về 1 khi search/category thay đổi) |
| `pageSize`        | `useState(20)`                                                          | Items per page (có thể fixed)                          |
| `data`            | `useGetMaterials({ search, category: categoryFilter, page, pageSize })` | API response: `Paginated<Material>`                    |
| `dialogOpen`      | `useState(false)`                                                       | Create dialog                                          |
| `editingMaterial` | `useState<Material \| null>(null)`                                      | Edit dialog target                                     |
| `deleteTarget`    | `useState<Material \| null>(null)`                                      | Delete confirm target                                  |

### 4.2 Data Flow

```
useGetMaterials({ search, category, page, pageSize })
    │
    ▼
Paginated<Material> { items: Material[], meta: { page, total, ... } }
    │
    ├── items ──► useReactTable(data=items) ──► DataTable
    │
    ├── meta.total ──► Header stats
    │
    └── meta.page, meta.totalPages ──► Footer info

Filter change:
  search/category change → reset page=1 → refetch useGetMaterials

Pagination:
  page change → refetch useGetMaterials

Mutation success:
  Post/Patch/Delete → invalidateQueries(materialKeys.list()) → refetch list
```

### 4.3 Create Dialog Flow

```
Header "Thêm vật tư" → setDialogOpen(true)
    ↓
CreateMaterialDialog mounts → useAddMaterial() init form
    ↓
User fills form → Submit
    ↓
onSuccess → invalidateQueries → setDialogOpen(false) → form auto-reset
```

### 4.4 Edit Dialog Flow

```
Row edit button → setEditingMaterial(material)
    ↓
EditMaterialDialog renders (open = material !== null)
    ↓
EditForm mounts (only when material !== null → pre-fill đúng)
    ↓
User edits → Submit (chỉ gửi dirty fields)
    ↓
onSuccess → invalidateQueries → setEditingMaterial(null)
```

### 4.5 Delete Flow

```
Row delete button → setDeleteTarget(material)
    ↓
DeleteConfirmDialog opens
    ↓
Confirm → deleteMaterial(id) → invalidateQueries → setDeleteTarget(null)
```

---

## 5. Column Spec

| Column     | `accessorKey` | `size` | `minSize` | Ghi chú                                    |
| ---------- | ------------- | ------ | --------- | ------------------------------------------ |
| Mã         | `code`        | 140    | 100       | `font-mono text-xs`                        |
| Tên        | `name`        | 300    | 180       | `font-medium`                              |
| Danh mục   | `category`    | 160    | 120       | Badge màu + tên (`SimpleMaterialCategory`) |
| Đơn vị     | `unit`        | 130    | 100       | `code - name` (`SimpleUnit`)               |
| Mô tả      | `description` | —      | 120       | `text-muted-foreground`, ẩn trên mobile    |
| Trạng thái | `isActive`    | 100    | 80        | Badge "Hoạt động" / "Vô hiệu"              |
| Actions    | —             | —      | 80        | Edit + Delete icon buttons                 |

```typescript
export function createColumns({
    onEdit,
    onDelete,
}: {
    onEdit: (material: Material) => void;
    onDelete: (material: Material) => void;
}): ColumnDef<Material>[];
```

---

## 6. Components

| Component               | Nguồn                                   | Dùng cho                            |
| ----------------------- | --------------------------------------- | ----------------------------------- |
| `DataTable`             | `@/components/ui/data-table`            | Table body                          |
| `Button`                | `@/components/ui/button`                | Actions, submit                     |
| `Badge`                 | `@/components/ui/badge`                 | Category màu, trạng thái            |
| `Dialog`                | `@/components/ui/dialog`                | Create/Edit form                    |
| `DeleteConfirmDialog`   | `@/components/ui/delete-confirm-dialog` | Delete confirm                      |
| `InputField`            | `@/components/form/InputField`          | Form fields                         |
| `TextareaField`         | `@/components/form/TextareaField`       | Form description                    |
| `CategorySelectField`   | `@/features/material-category`          | Category select (đã có)             |
| `UnitSelectField`       | `@/features/unit`                       | Unit select (đã có)                 |
| `useGetMaterials`       | `@/features/material`                   | Data fetching                       |
| `useAddMaterial`        | `@/features/material`                   | Create mutation                     |
| `useUpdateMaterial`     | `@/features/material`                   | Update mutation                     |
| `useDeleteMaterial`     | `@/features/material`                   | Delete mutation                     |
| `useGetCategories`      | `@/features/material-category`          | Category dropdown (trong FilterBar) |
| `getCategoryColorClass` | `@/features/material-category`          | Badge màu trong columns             |

---

## 7. Files Plan

| File                | Action       | Nội dung                                                  |
| ------------------- | ------------ | --------------------------------------------------------- |
| `page.tsx`          | **Viết lại** | State management, wire data layer, dialog orchestration   |
| `header.tsx`        | **Sửa**      | Wire `onAdd`, đổi icon `Package01Icon`, dùng `meta.total` |
| `filter-bar.tsx`    | **Viết lại** | Search + category dropdown (server-side params)           |
| `columns.tsx`       | **Viết lại** | 7 cột đúng field, actions, badge màu                      |
| `table-section.tsx` | **Giữ**      | Đã đúng                                                   |
| `footer.tsx`        | **Viết lại** | Hiển thị page info từ `meta`                              |
| `create-dialog.tsx` | **Tạo mới**  | Dialog + Form + `useAddMaterial`                          |
| `edit-dialog.tsx`   | **Tạo mới**  | Dialog + Form + `useUpdateMaterial` (pre-fill)            |

---

## 8. Implementation Order

```
1. columns.tsx       ← Định nghĩa cột + createColumns({ onEdit, onDelete })
2. create-dialog.tsx ← Dialog tạo mới
3. edit-dialog.tsx   ← Dialog chỉnh sửa
4. header.tsx        ← Wire onAdd, dùng data thật
5. filter-bar.tsx    ← Search + Category filter server-side
6. footer.tsx        ← Page info server-side
7. page.tsx          ← Container: wire tất cả
```

---

## 9. Quyết định thiết kế

| #   | Quyết định                                      | Lý do                                                                                                 |
| --- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| D1  | **Server-side pagination**                      | API trả về `meta` (page, total, totalPages). Không dùng `DataTablePagination` client-side             |
| D2  | **Server-side search/filter**                   | API hỗ trợ `?search=` + `?category=`. Gửi params lên server, không filter client                      |
| D3  | **Reset page=1 khi filter thay đổi**            | Search/category change → về trang 1, tránh page > totalPages                                          |
| D4  | **Dùng `useReactTable` thay vì `useDataTable`** | `useDataTable` là wrapper cũ với mock data. Dùng trực tiếp TanStack Table API như material-categories |
| D5  | **`useGetMaterials` nhận object params**        | `{ search?, category?, page?, pageSize? }` — gọn, dễ mở rộng                                          |
| D6  | **Category dropdown dùng `useGetCategories()`** | Lấy danh sách phẳng, hiển thị tên (không cần tree vì đây là filter, không phải select parent)         |
| D7  | **Dialog dùng `onOpenChangeComplete`**          | Pattern chuẩn Base UI cho animation, như edit-dialog material-categories                              |
| D8  | **Edit form dùng Form Pre-fill Pattern**        | Child component `EditMaterialForm` chỉ mount khi `material !== null`                                  |
| D9  | **Cột mô tả ẩn trên mobile**                    | `hidden sm:table-cell` — giống các page khác                                                          |
| D10 | **Section quy đổi dùng `FieldArray`**           | Formisch `FieldArray` + `insert`/`remove` cho danh sách `{ toUnitId, factor }` động |
| D11 | **Watch `unitId` để bật/tắt section quy đổi**   | Dùng `<Field of={form} path={["unitId"]}>` để đọc selected unit, so `conversionType` |
| D12 | **Edit prefill từ `useGetMaterial(id)` detail** | Detail response có `conversions` (read-only nested) → convert sang `{ toUnitId, factor }` cho form |
| D13 | **`conversions` gửi cả mảng trong PATCH**       | Backend replace toàn bộ — form giữ state list đầy đủ, không merge |

---

## 10. Conversion Section (Material form)

### Mockup — unit material (BAO)

```
┌──────────────────────────────────────────────────────────┐
│  Đơn vị tính *                                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │ BAO - Bao (Theo vật tư)                      ▾  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ── Quy đổi theo vật tư ─────────────────────────────── │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 1 BAO = [ 50    ] [ KG ▾ ]                [🗑]  │   │
│  │ 1 BAO = [ 40    ] [ KG ▾ ]                [🗑]  │   │
│  └──────────────────────────────────────────────────┘   │
│  [+ Thêm quy đổi]                                        │
└──────────────────────────────────────────────────────────┘
```

### State flow

```
User chọn unitId (material-type)
  → Field of unitId re-render
    → selectedUnit.conversionType === "material"
      → render ConversionSection (FieldArray of conversions)

[+ Thêm quy đổi]
  → insert(form, { path: ["conversions"], initialInput: { toUnitId: null, factor: "1" } })

[🗑]
  → remove(form, { path: ["conversions"], at: index })

Submit
  → useAddMaterial / useUpdateMaterial gửi cả mảng conversions
  → backend replace (PATCH) hoặc create (POST)
```
