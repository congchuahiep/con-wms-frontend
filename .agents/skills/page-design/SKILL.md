---
name: page-design
description: "Thiết kế UI layer cho một page trong con-wms-frontend: phân tích layout, vẽ mockup ASCII, chọn component từ shadcn/ui, lên spec tương tác. Dùng khi user yêu cầu 'thiết kế UI cho page X', 'làm giao diện cho feature Y', hoặc sau khi feature-design hoàn thành và cần dựng UI."
---

# Page Design — con-wms-frontend

Quy trình thiết kế tầng UI cho bất kỳ page mới nào trong dự án con-wms-frontend.

## Vai trò

Skill này chỉ giải quyết **UI layer**. Nó trả lời câu hỏi:

- Page này trông như thế nào? (mockup ASCII)
- Gồm những component nào?
- Data flow như thế nào? (props, state, context)
- Dùng component nào từ shadcn/ui?

Skill này **yêu cầu** data layer đã được thiết kế trước (bởi skill `feature-design` hoặc có sẵn).

## Đầu vào cần có

Trước khi bắt đầu, xác nhận với user:

| Mục | Trạng thái |
|---|---|
| Data layer đã có (`src/features/<name>/types.ts`, `services.ts`) | Bắt buộc |
| Mô tả UX từ user (page này để làm gì? ai dùng?) | Bắt buộc |
| Trang tham khảo (page có sẵn tương tự để copy layout) | Nên có |
| Design docs từ `feature-design` (`docs/features/<name>/`) | Tốt nếu có |

## Quy trình

### Bước 0: Xác định loại page

| Page Type | Khi nào dùng | Template |
|---|---|---|
| `table` | Danh sách dạng bảng, cột, sort, pagination | `templates/table/` |
| `tree` | Dữ liệu phân cấp, expand/collapse | `templates/tree/` |
| `table-tree` | Tree hiển thị dạng table (TanStack Table `getSubRows`) | Dùng structure `table` + tree behavior |
| `form` | Trang tạo/sửa, form là nội dung chính | `templates/form/` |

### Bước 1: Phân tích UX

1. **Ai dùng?** → Quyết định mức độ phức tạp
2. **Cần làm gì?** → Primary/secondary action
3. **Dữ liệu hiển thị thế nào?** → Table? Tree? Cards?
4. **Có filter/search không?** → Filter bar
5. **Có form create/edit không?** → Dialog hay inline?

### Bước 2: Vẽ Mockup ASCII

Nguyên tắc: Unicode box-drawing, emoji/placeholder cho icon, `[text]` = primary button, `(text)` = disabled, `←` = comment.

### Bước 3: Dựng component tree + State Flow

### Bước 4: Chọn components

| Loại UI | Component | Nguồn |
|---|---|---|
| Button | `Button` | `@/components/ui/button` |
| Table | `DataTable` | `@/components/ui/data-table` |
| Dialog/Modal | `Dialog` | `@/components/ui/dialog` |
| Confirm delete | `DeleteConfirmDialog` | `@/components/ui/delete-confirm-dialog` |
| Badge | `Badge` | `@/components/ui/badge` |
| Search input | `Input` + `HugeiconsIcon` | `@/components/ui/input` |
| Select | `Select` | `@/components/ui/select` |
| Icons | `HugeiconsIcon` | `@hugeicons/react` |

### Form fields — luôn dùng `@/components/form/`

| Field type | Component | Nguồn |
|---|---|---|
| Text input | `InputField` | `@/components/form/InputField` |
| Textarea | `TextareaField` | `@/components/form/TextareaField` |
| Select/Dropdown | `SelectField` | `@/components/form/SelectField` |

**Pattern dùng field components:**

```tsx
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";

// Input đơn giản
<InputField of={form} path={["code"]} label="Mã" placeholder="VD: VLXD" required />

// Input với transform (string → number/null)
<InputField of={form} path={["parentId"]} label="Danh mục cha"
  transform={(v) => (v === "" ? null : Number(v))} />

// Select cơ bản
<SelectField of={form} path={["color"]} label="Màu sắc"
  options={[{ value: "red", label: "Đỏ" }, ...]} />

// Select với custom render dropdown item + clean trigger
<SelectField of={form} path={["color"]} label="Màu sắc"
  options={colorOptions}
  renderOption={(opt) => <><span className="size-3 rounded-full bg-red-500" /> {opt.label}</>}
  renderValue={(opt) => opt.label.replace(/^[\u00A0]+/, "")}  // strip indent
/>

// Select tree parent (flatten client-side, indent = \u00A0)
const parentOptions = flattenForSelect(categories);
<SelectField of={form} path={["parentId"]} label="Danh mục cha"
  options={parentOptions}
  transform={(v) => (v === "" ? null : Number(v))}
  renderValue={(opt) => opt.label.replace(/^[\u00A0]+/, "")}
/>
```

### Bước 5: Chờ duyệt + Triển khai

1. Trình bày **mockup + component tree + state flow** cho user
2. Hỏi: "Có muốn thay đổi gì không?"
3. Sau khi duyệt → code từng file từ trên xuống dưới

---

## Cấu trúc file page

### Table / Table-tree

```
src/app/(app)/<route>/
├── page.tsx          ← Container: state, data fetching, layout
├── header.tsx        ← Tiêu đề + stats + actions (onAdd prop)
├── filter-bar.tsx    ← Search input + filters
├── columns.tsx       ← Column definitions (hàm `createColumns({ onEdit, onDelete })`)
├── table-section.tsx ← Bọc DataTable với overflow-auto
├── footer.tsx        ← Tổng count / pagination
├── create-dialog.tsx ← Dialog tạo mới (usePost / useAddXxx)
├── edit-dialog.tsx   ← Dialog chỉnh sửa (usePartialUpdate / useUpdateXxx)
```

### Dialog (create/edit/delete)

```
create-dialog.tsx     ← Dialog + Form + usePost/useAddXxx
edit-dialog.tsx       ← Dialog + Form + usePartialUpdate/useUpdateXxx
                       └── EditCategoryForm (child, mount khi có data → pre-fill đúng)
delete-confirm        ← DeleteConfirmDialog component
```

---

## Column Sizing Convention

Mọi table dùng `DataTable` component — đã tự động `table-fixed` + column sizing.

```typescript
// Trong columns.tsx — mỗi column set size/minSize
export function createColumns(...): ColumnDef<T>[] {
  return [
    { id: "name",  size: 350, minSize: 200, ... },  // fixed
    { id: "code",  size: 120, minSize: 80,  ... },  // fixed
    { id: "color",            minSize: 100, ... },  // flexible (cột cuối, không set size)
    { id: "actions",          minSize: 40,  ... },  // flexible
  ];
}
```

- **Cột cuối** không set `size` → tự động ăn phần còn lại của table width
- **Tất cả cột** có `minSize` → trigger scroll ngang khi container quá hẹp
- `DataTable` tự tính `min-width = sum(minSize)` từ column definitions

---

## Dialog Animation Pattern

**Vấn đề:** Khi `onClose()` set state về null → content unmount ngay → animation vỡ.

**Giải pháp:** Dialog tự quản lý `open` nội bộ, dùng `onOpenChangeComplete` của Base UI để clean up **sau khi animation hoàn tất**:

```tsx
export function EditXxxDialog({ entity, onClose }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => { if (entity) setOpen(true); }, [entity]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        {entity && <FormContent entity={entity} onClose={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}
```

> **`onOpenChangeComplete` là API chính thức của Base UI Dialog.** Không dùng `setTimeout` — kém chính xác.

**Lưu ý quan trọng:**
- `DialogContent` luôn render (không conditional) — để Base UI có phần tử animate
- Form content conditional `{category && <Form />}` — chỉ mount khi có data
- **Không dùng `{category && <DialogContent><Form /></DialogContent>}`** — sẽ vỡ animation

---

## Form Pre-fill Pattern

**Vấn đề:** `useForm({ initialInput })` chỉ đọc `initialInput` lúc mount. Nếu component mount với `initialInput` rỗng rồi sau đó data mới có, form không cập nhật.

**Giải pháp:** Tách form ra child component, chỉ mount khi có data:

```tsx
// ❌ Sai — form mount với giá trị rỗng, không cập nhật khi category thay đổi
function EditDialog({ category }) {
  const form = useForm({ initialInput: { code: category?.code ?? "", ... } });
  if (!category) return null;
  return <DialogContent>...</DialogContent>;
}

// ✅ Đúng — EditForm chỉ mount khi category !== null
function EditDialog({ category }) {
  return (
    <Dialog ...>
      <DialogContent>
        {category && <EditForm category={category} />}
      </DialogContent>
    </Dialog>
  );
}
```

---

## Delete Confirm Pattern

Dùng `DeleteConfirmDialog` component — tự quản lý animation giống EditDialog:

```tsx
// page.tsx
const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
const { mutate: deleteItem } = useDeleteXxx();

<DeleteConfirmDialog
  open={deleteTarget !== null}
  onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
  title="Xoá danh mục"
  description={`Bạn có chắc muốn xoá "${deleteTarget?.name}"?`}
  onConfirm={() => { if (deleteTarget) deleteItem(deleteTarget.id); }}
/>
```

---

## Layout nguyên tắc

Container ngoài cùng: `flex h-full min-h-0 max-h-full flex-col`

- Header + FilterBar: `shrink-0`
- Content (table): `flex-1 min-h-0 overflow-auto`
- Footer: `shrink-0`

## Ví dụ page đã làm

Xem `src/app/(app)/material-categories/` — Material Categories dạng `table-tree`, đầy đủ create/edit/delete dialog.
Xem `docs/features/material-category/` — Design docs đầy đủ (create-dialog.md, edit-dialog.md).
