# UnitConversion — Page Design

> **v1.1** — Dùng DataTable sub-components (TanStack expand pattern), chỉ quy đổi toàn cục

## Bước 0: Xác định loại page

**`table` với sub-components** — Bảng Units chính + expand row hiển thị bảng conversion bên dưới.

Pattern: TanStack Table **sub-components** — mỗi row expand hiển thị custom UI (không phải sub-rows cùng cấu trúc như `getSubRows`).

**Trang tham khảo:** `src/app/(app)/material-categories/` — dùng `getSubRows` cho tree. Pattern này dùng `getRowCanExpand` + render sub-component JSX.

---

## Bước 1: Phân tích UX

| # | Câu hỏi | Trả lời |
|---|---|---|
| 1 | **Ai dùng?** | Admin + Thủ kho: CRUD conversion. Nhân viên khác: chỉ xem |
| 2 | **Cần làm gì?** | Xem quy đổi của 1 đơn vị bằng cách expand row. Thêm/sửa/xoá quy đổi |
| 3 | **Dữ liệu hiển thị thế nào?** | Row chính: Mã \| Tên \| Thao tác. Row expand: bảng conversion |
| 4 | **Có filter/search không?** | Search vẫn filter unit, không ảnh hưởng conversion |
| 5 | **Có form create/edit không?** | Dialog con: create-conversion, edit-conversion |

---

## Bước 2: Mockup ASCII

### Trạng thái bình thường (rows collapsed)

```
┌──────────────────────────────────────────────────────────────┐
│  ⚖️  Đơn vị tính                    5 đơn vị   [+ Thêm đơn vị] │
├──────────────────────────────────────────────────────────────┤
│  🔍 Tìm mã, tên đơn vị...                                    │
├──────────────────────────────────────────────────────────────┤
│  Mã          │ Tên                    │                      │
│  ▶ BAO       │ Bao                    │        ✏️  🗑️        │  ← expand button
│  ▶ KG        │ Kilogram               │        ✏️  🗑️        │
│  ▶ M3        │ Mét khối               │        ✏️  🗑️        │
│  ▶ TAN       │ Tấn                    │        ✏️  🗑️        │
├──────────────────────────────────────────────────────────────┤
│  5 đơn vị                                                     │
└──────────────────────────────────────────────────────────────┘
```

### Row expanded (BAO)

```
┌──────────────────────────────────────────────────────────────┐
│  Mã          │ Tên                    │                      │
│  ▼ BAO       │ Bao                    │        ✏️  🗑️        │  ← expanded
│              ├────────────────────────┤                      │
│              │ Quy đổi toàn cục                  [+ Thêm]    │  ← sub-component
│              │ ┌──────────────────────────────────────────┐  │
│              │ │ Quy đổi            │ Hệ số    │          │  │
│              │ │ 1 BAO = KG         │ 1000.0   │  ✏️ 🗑️   │  │
│              │ └──────────────────────────────────────────┘  │
│              │ (Chưa có quy đổi)                              │
├──────────────────────────────────────────────────────────────┤
│  ▶ KG        │ Kilogram               │        ✏️  🗑️        │
│  ▶ M3        │ Mét khối               │        ✏️  🗑️        │
│  ▶ TAN       │ Tấn                    │        ✏️  🗑️        │
```

### Create Conversion Dialog

```
┌─────────────────────────────────────┐
│  Thêm quy đổi — BAO                 │
│  1 BAO = ?                         │
│                                     │
│  Đơn vị đích *                      │
│  ┌─────────────────────────────┐    │
│  │ Chọn đơn vị...          ▾   │    │  ← SelectField (danh sách units, trừ unit gốc)
│  └─────────────────────────────┘    │
│                                     │
│  Hệ số quy đổi *                    │
│  ┌─────────────────────────────┐    │
│  │ 1000                        │    │  ← InputField type="number"
│  └─────────────────────────────┘    │
│                                     │
│              [Hủy]  [Thêm quy đổi]  │
└─────────────────────────────────────┘
```

### Edit Conversion Dialog

```
┌─────────────────────────────────────┐
│  Sửa quy đổi                        │
│  1 BAO = KG                        │
│                                     │
│  Hệ số quy đổi *                    │
│  ┌─────────────────────────────┐    │
│  │ 1000                        │    │  ← InputField type="number" (pre-filled)
│  └─────────────────────────────┘    │
│                                     │
│              [Hủy]  [Lưu thay đổi]  │
└─────────────────────────────────────┘
```

---

## Bước 3: Component Tree + State Flow

### Cấu trúc file

```
src/app/(app)/units/
├── page.tsx                    ← + expanded state, conversion fetching
├── columns.tsx                 ← + expand button column
├── conversion-subtable.tsx     ← ✨ MỚI: Sub-component render trong row expand
├── create-conversion-dialog.tsx ← ✨ MỚI: Form thêm quy đổi (toàn cục)
├── edit-conversion-dialog.tsx  ← ✨ MỚI: Form sửa hệ số
└── (các file cũ giữ nguyên)
```

```
src/features/unit-conversion/
├── types.ts                    ← ✨ MỚI
├── schemas.ts                  ← ✨ MỚI
├── services.ts                 ← ✨ MỚI
└── index.ts                    ← ✨ MỚI
```

### State ownership (page.tsx)

```
page.tsx
├── search: string
├── dialogOpen: boolean                      ← create unit dialog
├── editingUnit: Unit | null                 ← edit unit dialog
├── deleteTarget: Unit | null                ← delete unit confirm
├── expanded: ExpandedState                 ← ✨ MỚI: TanStack expanded state
├── conversionsMap: Record<number, DetailedUnit>  ← ✨ MỚI: cache conversion data
│
├── table:
│   state: { expanded }
│   onExpandedChange: setExpanded
│   getRowCanExpand: () => true
│   renderSubComponent: ({ row }) => <ConversionSubtable unitId={row.original.id} />
│
├── ConversionSubtable (sub-component)
│   ├── props: { unitId }
│   ├── useGetUnitConversions(unitId) → { globalConversions }
│   ├── state: createDialogOpen, editingConversion, deleteTarget
│   ├── Bảng DataTable hiển thị globalConversions
│   │   └── Cột: Quy đổi | Hệ số | Thao tác (✏️🗑️)
│   ├── [+ Thêm quy đổi] button → CreateConversionDialog
│   ├── CreateConversionDialog
│   │   └── props: { unitId, unitCode, open, onClose }
│   │   └── useAddConversion(unitId)
│   ├── EditConversionDialog
│   │   └── props: { conversion, unitCode, toUnitCode, open, onClose }
│   │   └── useUpdateConversion(conversion.id)
│   └── DeleteConfirmDialog
│       └── useDeleteConversion()
```

### Data flow: Expand row

```
User click ▶ trên row BAO
  → onExpandedChange → setExpanded({ 1: true })  (id=1 là BAO)
  → table re-render
  → row.getIsExpanded() === true
  → render <ConversionSubtable unitId={1} />
    → useGetUnitConversions(1) fetch
    → render bảng globalConversions
```

### Data flow: Thêm quy đổi

```
[+ Thêm quy đổi] trong subtable
  → ConversionSubtable: setCreateDialogOpen(true)
  → CreateConversionDialog mount
    → user chọn: toUnitId, factor
    → submit → useAddConversion(unitId).mutate(data)
      → onSuccess: invalidate unitConversionKeys.byUnit(unitId)
      → setCreateDialogOpen(false)
```

### Data flow: Sửa quy đổi

```
✏️ click → setEditingConversion(conv)
  → EditConversionDialog mount
    → user sửa factor
    → submit → useUpdateConversion(conv.id).handleSubmit
      → onSuccess: invalidate
```

---

## Bước 4: Component Selection

### Bảng Units chính (columns.tsx — thay đổi)

```typescript
// Thêm cột expand button (dùng chung cột "name" hoặc cột riêng)
// Pattern từ TanStack sub-components example:

{
  id: "name",
  cell: ({ row, getValue }) => {
    const canExpand = row.getCanExpand();
    const isExpanded = row.getIsExpanded();
    return (
      <div className="flex items-center gap-1">
        {canExpand && (
          <Button size="icon-xs" variant="outline" onClick={row.getToggleExpandedHandler()}>
            <HugeiconsIcon icon={isExpanded ? ArrowDown01Icon : ArrowRight01Icon} />
          </Button>
        )}
        <span className="font-medium">{getValue<string>()}</span>
      </div>
    );
  },
}
```

### Conversion Subtable (component mới)

| UI Element | Component | Ghi chú |
|---|---|---|
| Section header | `<div>` + `Button` [+ Thêm] | "Quy đổi toàn cục" |
| Bảng conversion | `DataTable` | Columns: Quy đổi \| Hệ số \| Thao tác |
| Empty state | Text muted | "Chưa có quy đổi" |
| Row actions | `Button size="icon-xs" variant="ghost"` | ✏️ 🗑️ |
| Loading | Spinner/skeleton | Khi đang fetch |

### Conversion Table Columns

```typescript
// conversion-subtable.tsx
const conversionColumns: ColumnDef<UnitConversion>[] = [
  {
    id: "formula",
    header: "Quy đổi",
    cell: ({ row }) => (
      <span>1 {fromUnitCode} = {row.original.factor} {row.original.toUnit.code}</span>
    ),
    size: 300,
    minSize: 200,
  },
  {
    id: "factor",
    accessorKey: "factor",
    header: "Hệ số",
    cell: ({ getValue }) => <code>{getValue<string>()}</code>,
    size: 100,
    minSize: 80,
  },
  {
    id: "actions",
    header: "",
    minSize: 40,
    cell: ({ row }) => (
      <div className="flex justify-end gap-0.5">
        <Button size="icon-xs" variant="ghost" onClick={() => onEdit(row.original)}>
          <HugeiconsIcon icon={PencilEdit01Icon} />
        </Button>
        <Button size="icon-xs" variant="ghost" onClick={() => onDelete(row.original)}>
          <HugeiconsIcon icon={Delete02Icon} className="text-destructive" />
        </Button>
      </div>
    ),
  },
];
```

### Create Conversion Dialog

| UI Element | Component | Ghi chú |
|---|---|---|
| To unit select | `SelectField` | Options: units trừ unit gốc |
| Factor input | `InputField` | `type="number" step="any"` |

### Edit Conversion Dialog

| UI Element | Component | Ghi chú |
|---|---|---|
| Factor input | `InputField` | Pre-filled, `type="number"` |

---

## Bước 5: Chờ duyệt

> **Trạng thái:** 🔵 Chờ user duyệt trước khi code
>
> **Thay đổi chính so với thiết kế trước:**
> - ~~Detail Dialog~~ → **Row expand (sub-components)** — nhất quán TanStack Table
> - ~~Material scope~~ → **Chỉ toàn cục** — backlog quy đổi theo vật tư
> - ~~Dialog chứa 2 bảng~~ → **Subtable trong row expand** — 1 bảng global conversions
> - Cột "name" trong Units table thêm nút ▶/▼ expand
