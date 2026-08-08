# Page Design — Units (Đơn vị tính)

> **v1.0** — Thiết kế UI lần đầu

## Bước 0: Xác định loại page

**`table`** — danh sách phẳng, không tree, không pagination.

| Tiêu chí         | Giá trị                             |
| ---------------- | ----------------------------------- |
| Page type        | `table`                             |
| Cấu trúc dữ liệu | Phẳng (`Unit[]`, không có children) |
| Số lượng items   | ≤ 20, không paginate                |
| Search           | Client-side, filter mảng phẳng      |

**Trang tham khảo:** `src/app/(app)/material-categories/` — dạng `table-tree`. Units đơn giản hơn (bỏ tree behavior).

---

## Bước 1: Phân tích UX

| #   | Câu hỏi                        | Trả lời                                                                     |
| --- | ------------------------------ | --------------------------------------------------------------------------- |
| 1   | **Ai dùng?**                   | Admin + Thủ kho: full CRUD. Nhân viên khác: chỉ xem (GET)                   |
| 2   | **Cần làm gì?**                | Primary: xem danh sách đơn vị. Secondary: thêm / sửa / xoá                  |
| 3   | **Dữ liệu hiển thị thế nào?**  | Table phẳng 3 cột: Mã                                                       | Tên | Thao tác |
| 4   | **Có filter/search không?**    | Search bar tìm `code` / `name` (client-side, mảng phẳng)                    |
| 5   | **Có form create/edit không?** | Dialog: create (2 field), edit (2 field pre-filled). Delete: confirm dialog |

---

## Bước 2: Mockup ASCII

### Trạng thái bình thường (có dữ liệu)

```
┌──────────────────────────────────────────────────────────────┐
│  ⚖️  Đơn vị tính                    5 đơn vị   [+ Thêm đơn vị] │  ← header (shrink-0)
├──────────────────────────────────────────────────────────────┤
│  🔍 Tìm mã, tên đơn vị...                                    │  ← filter-bar (shrink-0)
├──────────────────────────────────────────────────────────────┤
│  Mã          │ Tên                    │                      │
│  BAO         │ Bao                    │        ✏️  🗑️        │  ← table
│  KG          │ Kilogram               │        ✏️  🗑️        │    (flex-1 min-h-0 overflow-auto)
│  M3          │ Mét khối               │        ✏️  🗑️        │
│  TAN         │ Tấn                    │        ✏️  🗑️        │
├──────────────────────────────────────────────────────────────┤
│  5 đơn vị                                                     │  ← footer (shrink-0)
└──────────────────────────────────────────────────────────────┘
```

### Trạng thái tìm kiếm (filter)

```
┌──────────────────────────────────────────────────────────────┐
│  ⚖️  Đơn vị tính                    5 đơn vị   [+ Thêm đơn vị] │
├──────────────────────────────────────────────────────────────┤
│  🔍 BAO                                                       │
├──────────────────────────────────────────────────────────────┤
│  Mã          │ Tên                    │                      │
│  BAO         │ Bao                    │        ✏️  🗑️        │
├──────────────────────────────────────────────────────────────┤
│  1 / 5 đơn vị                                                 │  ← filtered count / total
└──────────────────────────────────────────────────────────────┘
```

### Dialog Create

```
┌─────────────────────────────────────┐
│  Thêm đơn vị tính                   │
│  Tạo đơn vị tính mới               │
│                                     │
│  Mã đơn vị *                        │
│  ┌─────────────────────────────┐    │
│  │ VD: KG                       │    │  ← InputField code
│  └─────────────────────────────┘    │
│                                     │
│  Tên đơn vị *                       │
│  ┌─────────────────────────────┐    │
│  │ Kilogram                     │    │  ← InputField name
│  └─────────────────────────────┘    │
│                                     │
│              [Hủy]  [Thêm đơn vị]   │
└─────────────────────────────────────┘
```

### Dialog Edit

```
┌─────────────────────────────────────┐
│  Sửa đơn vị tính                    │
│  Chỉnh sửa thông tin "Kilogram"    │
│                                     │
│  Mã đơn vị *                        │
│  ┌─────────────────────────────┐    │
│  │ KG                           │    │  ← pre-filled
│  └─────────────────────────────┘    │
│                                     │
│  Tên đơn vị *                       │
│  ┌─────────────────────────────┐    │
│  │ Kilogram                     │    │  ← pre-filled
│  └─────────────────────────────┘    │
│                                     │
│              [Hủy]  [Lưu thay đổi]  │  ← disabled nếu !isDirty
└─────────────────────────────────────┘
```

### Dialog Delete

```
┌─────────────────────────────────────┐
│  Xoá đơn vị                         │
│                                     │
│  Bạn có chắc muốn xoá "Kilogram"?   │
│  Hành động này không thể hoàn tác.  │
│                                     │
│              [Hủy]  [Xoá]           │
└─────────────────────────────────────┘
```

---

## Bước 3: Component Tree + State Flow

### Cấu trúc file

```
src/app/(app)/units/
├── page.tsx           ← Container (state management)
├── header.tsx         ← Title + stats + [+ Thêm đơn vị]
├── filter-bar.tsx     ← Search input
├── columns.tsx        ← createColumns({ onEdit, onDelete })
├── table-section.tsx  ← DataTable wrapper
├── footer.tsx         ← Tổng count
├── create-dialog.tsx  ← Dialog + Form + useAddUnit
└── edit-dialog.tsx    ← Dialog + Form + useUpdateUnit
```

### State ownership (tất cả state tập trung ở `page.tsx`)

```
page.tsx
├── search: string                          ← filter-bar value
├── dialogOpen: boolean                     ← create-dialog open
├── editingUnit: Unit | null                ← edit-dialog target
├── deleteTarget: Unit | null               ← delete confirm target
│
├── units: Unit[]                           ← từ useGetUnits()
├── filtered: Unit[]                        ← useMemo(units.filter(...), [units, search])
├── totalCount: number                      ← units.length
│
├── tableColumns                            ← useMemo(createColumns(...), [])
├── table                                   ← useReactTable({ data: filtered, columns })
│
├── deleteUnit.isPending                    ← loading state cho delete button
│
├─┬─ header          ← props: { totalUnits, onAdd }
├─┬─ filter-bar      ← props: { search, onSearchChange }
├─┬─ table-section   ← props: { table }
├─┬─ footer          ← props: { table, totalCount }
├─┬─ create-dialog   ← props: { open, onOpenChange }
├─┬─ edit-dialog     ← props: { unit, onClose }
└─┬─ DeleteConfirmDialog  ← props: { open, onOpenChange, title, description, onConfirm }
```

### Data flow: Search

```
filter-bar.onSearchChange(search)
  → page.tsx setSearch(text)
  → useMemo(() => units.filter(u => u.code.includes(search) || u.name.includes(search)))
  → table.setData(filtered)
  → DataTable re-render
  → footer hiển thị "visibleCount / totalCount"
```

### Data flow: Create

```
header.onAdd()
  → page.tsx setDialogOpen(true)
  → create-dialog render (open=true)
  → user fill form → submit
  → useAddUnit.mutate(data)
    → onSuccess: invalidate query cache → units list refresh
    → onSuccess callback: setDialogOpen(false)
  → dialog close animation → resetForm()
```

### Data flow: Edit

```
columns.onEdit(unit)
  → page.tsx setEditingUnit(unit)
  → edit-dialog useEffect: setOpen(true)
  → EditUnitForm mount (có data → pre-fill form)
  → user edit → submit
  → useUpdateUnit.handleSubmit (chỉ gửi dirty fields)
    → onSuccess: invalidate query cache
  → setOpen(false) → animation complete → onClose() → setEditingUnit(null)
```

### Data flow: Delete

```
columns.onDelete(unit)
  → page.tsx setDeleteTarget(unit)
  → DeleteConfirmDialog open
  → user confirm → deleteUnit.mutate(unit.id)
    → onSuccess: invalidate query cache
  → setDeleteTarget(null)
```

---

## Bước 4: Component Selection

### Cấu trúc layout

```
<div className="flex h-full min-h-0 max-h-full flex-col">   ← page.tsx
  <header />           ← shrink-0
  <filter-bar />       ← shrink-0
  <table-section>      ← flex-1 min-h-0 overflow-auto
    <DataTable />
  </table-section>
  <footer />           ← shrink-0
</div>
```

### Bảng components

| UI Element     | Component                                            | Source                                  | Ghi chú                                   |
| -------------- | ---------------------------------------------------- | --------------------------------------- | ----------------------------------------- |
| Page container | `<div>`                                              | Native                                  | `flex h-full min-h-0 max-h-full flex-col` |
| Header icon    | `WeightIcon`                                         | `@hugeicons/core-free-icons`            | Nhất quán sidebar                         |
| Icon wrapper   | `HugeiconsIcon`                                      | `@hugeicons/react`                      | `strokeWidth={2}`                         |
| Add button     | `Button`                                             | `@/components/ui/button`                | `size="sm"`, icon inline-start            |
| Search input   | `Input`                                              | `@/components/ui/input`                 | Wrap với icon search                      |
| Table          | `DataTable`                                          | `@/components/ui/data-table`            | `table={table}`                           |
| Table actions  | `Button`                                             | `@/components/ui/button`                | `size="icon-xs" variant="ghost"`          |
| Dialog         | `Dialog` + `DialogContent`                           | `@/components/ui/dialog`                | Từ shadcn/ui                              |
| Dialog header  | `DialogHeader` + `DialogTitle` + `DialogDescription` | `@/components/ui/dialog`                |                                           |
| Dialog footer  | `DialogFooter`                                       | `@/components/ui/dialog`                |                                           |
| Form wrapper   | `Form`                                               | `@formisch/react`                       | `of={form} onSubmit={handleSubmit}`       |
| Form field     | `InputField`                                         | `@/components/form/InputField`          | `of={form} path={["code"]}`               |
| Confirm delete | `DeleteConfirmDialog`                                | `@/components/ui/delete-confirm-dialog` | Pattern có sẵn                            |
| Error alert    | `Alert`                                              | `@/components/ui/alert`                 | Hiển thị non-validation error             |

### Column definitions

```typescript
export function createColumns({ onEdit, onDelete }: ColumnsOptions): ColumnDef<Unit>[] {
  return [
    {
      id: "code",
      accessorKey: "code",
      header: "Mã",
      cell: ({ getValue }) => <code>{getValue<string>()}</code>,
      size: 120,
      minSize: 80,
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Tên",
      cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
      size: 350,
      minSize: 200,
    },
    {
      id: "actions",
      header: "",
      minSize: 40,           // ← flexible, không set size
      cell: ({ row }) => (
        <div className="flex justify-end gap-0.5">
          <Button size="icon-xs" variant="ghost" onClick={() => onEdit(row.original)}>
            <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} className="size-4" />
          </Button>
          <Button size="icon-xs" variant="ghost" onClick={() => onDelete(row.original)}>
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="size-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];
}
```

### Dialog patterns

**Create dialog** — đơn giản, giống create Material Category nhưng chỉ 2 field:

```tsx
// Props: { open, onOpenChange }
// Dùng useAddUnit(), resetOnSuccess mặc định = true
// onOpenChangeComplete → resetForm() khi đóng
```

**Edit dialog** — pattern `onOpenChangeComplete`:

```tsx
// Props: { unit: Unit | null, onClose }
// Dialog tự quản lý open nội bộ
// Child EditUnitForm chỉ mount khi unit !== null
// onOpenChangeComplete → onClose() khi animation xong
```

**Delete** — `DeleteConfirmDialog`:

```tsx
// page.tsx quản lý deleteTarget state
// DeleteConfirmDialog tự quản lý animation
```

---

## Bước 5: Chờ duyệt

> **Trạng thái:** 🔵 Chờ user duyệt trước khi code UI
