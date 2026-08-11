# UnitConversion — Page Design

> **v2.0** — Quy đổi tích hợp vào Edit Unit Dialog (không expand row)

## Bước 0: Xác định loại page

**`dialog`** — Quy đổi hiển thị và quản lý ngay trong Edit Unit Dialog. Không thay đổi bảng Units chính.

**Lý do:** Expand row trong table gây rối thao tác. Edit Dialog là nơi tự nhiên để xem/sửa conversion vì conversion thuộc về 1 unit cụ thể.

---

## Bước 1: Phân tích UX

| # | Câu hỏi | Trả lời |
|---|---|---|
| 1 | **Ai dùng?** | Admin + Thủ kho: CRUD conversion. Nhân viên khác: chỉ xem (GET) |
| 2 | **Cần làm gì?** | Khi edit unit → thấy danh sách quy đổi, thêm/sửa/xoá ngay trong dialog |
| 3 | **Dữ liệu hiển thị thế nào?** | Bảng nhỏ trong Edit Dialog: Quy đổi \| Hệ số \| Thao tác |
| 4 | **Có filter/search không?** | Không (≤ 10 conversions) |
| 5 | **Form create conversion?** | Dialog con mở từ nút [+ Thêm] trong Edit Dialog |

---

## Bước 2: Mockup ASCII

### Edit Unit Dialog (có quy đổi)

```
┌──────────────────────────────────────────────────────────┐
│  Sửa đơn vị tính                                         │
│  Chỉnh sửa thông tin "Bao"                              │
│                                                          │
│  Mã đơn vị *                                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │ BAO                                              │   │  ← InputField code
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Tên đơn vị *                                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Bao                                              │   │  ← InputField name
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ── Quy đổi toàn cục ────────────────────────────────── │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Quy đổi               │ Hệ số     │              │   │
│  │ 1 BAO = KG            │ 1000.0000 │    ✏️  🗑️    │   │  ← Bảng conversion
│  └──────────────────────────────────────────────────┘   │
│  [+ Thêm quy đổi]                                        │  ← Nút thêm
│                                                          │
│                         [Hủy]  [Lưu thay đổi]            │
└──────────────────────────────────────────────────────────┘
```

### Edit Dialog (không có quy đổi)

```
┌──────────────────────────────────────────────────────────┐
│  ... (form unit như trên) ...                            │
│                                                          │
│  ── Quy đổi toàn cục ────────────────────────────────── │
│                                                          │
│  Chưa có quy đổi nào                                     │  ← Empty state
│  [+ Thêm quy đổi]                                        │
└──────────────────────────────────────────────────────────┘
```

### Create Unit Dialog — giữ nguyên, không thay đổi

```
┌─────────────────────────────────────┐
│  Thêm đơn vị tính                   │
│  (chỉ code + name, không có quy đổi) │  ← Không đổi
└─────────────────────────────────────┘
```

---

## Bước 3: Component Tree + State Flow

### Cấu trúc file

```
src/app/(app)/units/
├── page.tsx                    ← KHÔNG đổi (không expand state)
├── columns.tsx                 ← KHÔNG đổi (không expand button)
├── edit-dialog.tsx             ← ✏️ SỬA: thêm section quy đổi
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

### State flow — Edit Dialog mở rộng

```
EditUnitDialog (sửa từ bản cũ)
├── props: { unit, onClose }
├── state nội bộ:
│   ├── open: boolean                      ← animation control
│   ├── createConversionOpen: boolean
│   ├── editingConversion: UnitConversion | null
│   └── deleteTarget: UnitConversion | null
│
├── DialogContent (luôn render)
│   └── {unit && <EditUnitFormContent unit={unit} />}
│       │
│       ├── Form unit (code + name)        ← giữ nguyên
│       │
│       ├── useGetUnitConversions(unit.id) ← ✨ fetch conversions
│       │   → { globalConversions }
│       │
│       ├── Section "Quy đổi toàn cục"
│       │   ├── Bảng DataTable globalConversions
│       │   │   └── Cột: Quy đổi | Hệ số | ✏️🗑️
│       │   └── [+ Thêm quy đổi] button
│       │
│       ├── CreateConversionDialog
│       │   └── props: { unit, open, onClose }
│       │
│       ├── EditConversionDialog
│       │   └── props: { conversion, unitCode, toUnitCode, open, onClose }
│       │
│       └── DeleteConfirmDialog
│           └── useDeleteConversion()
```

### Data flow: Mở Edit Dialog

```
✏️ click trên row BAO
  → page.tsx setEditingUnit(unit)
  → EditUnitDialog mount
    → useEffect: setOpen(true)
    → EditUnitFormContent mount (có unit)
      → useGetUnitConversions(unit.id) fetch
      → render bảng globalConversions
```

### Data flow: Thêm quy đổi

```
[+ Thêm quy đổi] trong Edit Dialog
  → setCreateConversionOpen(true)
  → CreateConversionDialog mount
    → user chọn: toUnitId, factor
    → submit → useAddConversion(unitId).mutate(data)
      → onSuccess: invalidate unitConversionKeys.byUnit(unitId)
      → setCreateConversionOpen(false)
```

### Data flow: Sửa quy đổi

```
✏️ click trên row conversion
  → setEditingConversion(conv)
  → EditConversionDialog mount
    → user sửa factor
    → submit → useUpdateConversion(conv.id).handleSubmit
      → onSuccess: invalidate
```

---

## Bước 4: Component Selection

### Edit Dialog (mở rộng)

| UI Element | Component | Ghi chú |
|---|---|---|
| Form unit | `InputField` × 2 | code + name (giữ nguyên) |
| Separator | `<div className="border-t my-4" />` | Ngăn cách form unit và conversion |
| Section title | `<h3>` + `Button` [+ Thêm] | "Quy đổi toàn cục" |
| Bảng conversion | `DataTable` | 3 cột: Quy đổi \| Hệ số \| Thao tác |
| Empty state | `<p className="text-muted-foreground text-sm py-4">` | |
| Loading | Skeleton/spinner | |
| Dialog footer | `DialogFooter` + Hủy/Lưu | Giữ nguyên vị trí cuối dialog |

### Conversion Table Columns

```typescript
const conversionColumns: ColumnDef<UnitConversion>[] = [
  {
    id: "formula",
    header: "Quy đổi",
    cell: ({ row }) => (
      <span>1 {fromUnitCode} = {parseFloat(row.original.factor)} {row.original.toUnit.code}</span>
    ),
    size: 300,
    minSize: 200,
  },
  {
    id: "factor",
    accessorKey: "factor",
    header: "Hệ số",
    cell: ({ getValue }) => <code>{parseFloat(getValue<string>()).toFixed(4)}</code>,
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

---

## Bước 5: Chờ duyệt

> **Trạng thái:** 🔵 Chờ user duyệt trước khi code
>
> **Tổng kết thiết kế v2.0:**
> - ~~Row expand~~ → **Edit Dialog mở rộng** — gọn, không rối table
> - Create Dialog: **không đổi** (chỉ code + name)
> - Edit Dialog: thêm section **Quy đổi toàn cục** + bảng DataTable
> - Chỉ toàn cục, material scope = backlog
> - File mới: 5 (data layer unit-conversion + 2 dialog con)
> - File sửa: 1 (`edit-dialog.tsx` thêm section conversion)
