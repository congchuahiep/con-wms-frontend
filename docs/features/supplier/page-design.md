# Page Design — Nhà cung cấp

> **Page type:** `table` (phẳng, chỉ search)
> **Route:** `src/app/(app)/suppliers/`
> **Tham khảo:** `src/app/(app)/materials/` (flat table + search + create/edit/delete)

## 1. Mockup ASCII

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [🚚] Nhà cung cấp         2 nhà cung cấp                     [+ Thêm nhà cung cấp] │  header
├────────────────────────────────────────────────────────────────────────────────┤
│ [🔍 Tìm mã, tên nhà cung cấp...____________________________]                    │  filter-bar
├────────────────────────────────────────────────────────────────────────────────┤
│ Mã      │ Tên nhà cung cấp            │ Người liên hệ    │ SĐT        │ Email… │ MST… │ Trạng thái    │ ⚙ │
│ NCC001  │ Công ty TNHH VLXD ABC       │ Anh Tuấn — QLBH   │ 0903123456 │ sales… │ 012… │ Đang hợp tác  │ ⋯ │
│ NCC002  │ Đại lý Sắt Thép Miền Tây    │ Chị Hương         │ 0918123456 │ huong… │ 098… │ Đang hợp tác  │ ⋯ │
├────────────────────────────────────────────────────────────────────────────────┤
│ 2 nhà cung cấp                                                                  │  footer (chỉ total)
└────────────────────────────────────────────────────────────────────────────────┘
```

## 2. Component tree

```
page.tsx (container)
├── header.tsx          ← icon + "Nhà cung cấp" + total + onAdd
├── filter-bar.tsx      ← search input (server-side)
├── table-section.tsx   ← <DataTable table={table} />
├── footer.tsx          ← total count (không pagination)
├── create-dialog.tsx   ← <Form> + useAddSupplier
├── edit-dialog.tsx     ← animation pattern + useUpdateSupplier
└── DeleteConfirmDialog  ← render trực tiếp trong page
```

## 3. State flow

```typescript
const { params, setSearch } = useSupplierParams();   // { search: "" }
const { data } = useGetSuppliers(params);            // Supplier[] (mảng phẳng)
const items = data ?? [];

const [dialogOpen, setDialogOpen] = useState(false);
const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);

const table = useReactTable({
  data: items,
  columns: tableColumns,
  getCoreRowModel: getCoreRowModel(),
});
```

## 4. Columns

| Column | accessor | Header | size/minSize | Ghi chú |
|---|---|---|---|---|
| code | `code` | Mã | 140/100 | `<code>` mono |
| name | `name` | Tên nhà cung cấp | 320/200 | `font-medium` |
| contactPerson | `contactPerson` | Người liên hệ | 180/140 | |
| phone | `phone` | SĐT | 140/110 | |
| email | `email` | Email | 200/140 | `hidden sm:table-cell` |
| taxCode | `taxCode` | MST | 140/110 | `hidden sm:table-cell` |
| isActive | `isActive` | Trạng thái | 120/100 | Badge |
| actions | — | — | minSize 80 | edit/delete (cột cuối flexible) |

```typescript
// Trạng thái badge
cell: ({ getValue }) => {
  const active = getValue<boolean>();
  return active
    ? <Badge variant="secondary">Đang hợp tác</Badge>
    : <Badge variant="outline">Ngừng hợp tác</Badge>;
}
```

## 5. Create dialog

- `useAddSupplier()` + `onSuccess → onOpenChange(false)`
- 8 field: `code`, `name`, `taxCode`, `contactPerson`, `phone`, `email`, `address` (textarea), `note` (textarea)
- Components: `InputField` (6) + `TextareaField` (2)

## 6. Edit dialog

- Animation pattern: `open` nội bộ + `onOpenChangeComplete` → `onClose()`
- Pre-fill trực tiếp từ `Supplier` row (không fetch detail)
- Child `EditSupplierForm` mount khi `supplier !== null`
- `useUpdateSupplier(supplier.id, initialInput)` + `isDirty` gating submit
- `onSuccess` → `toast` + đóng dialog

## 7. Delete confirm

```typescript
<DeleteConfirmDialog
  open={deleteTarget !== null}
  onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
  title="Vô hiệu hóa nhà cung cấp"
  description={<>Bạn có chắc muốn vô hiệu hóa nhà cung cấp <strong>&quot;{deleteTarget?.name}&quot;</strong>?</>}
  onConfirm={async () => { if (deleteTarget) await deleteSupplier(deleteTarget.id); }}
  isPending={isDeleting}
/>
```

## 8. Sidebar

Thêm vào group **"Danh mục"** trong `src/components/layout/app-sidebar.tsx`:

```typescript
{ title: "Nhà cung cấp", url: "/suppliers", icon: Truck01Icon },
```
