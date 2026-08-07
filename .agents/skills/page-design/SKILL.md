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

| Mục                                                              | Trạng thái |
| ---------------------------------------------------------------- | ---------- |
| Data layer đã có (`src/features/<name>/types.ts`, `services.ts`) | Bắt buộc   |
| Mô tả UX từ user (page này để làm gì? ai dùng?)                  | Bắt buộc   |
| Trang tham khảo (page có sẵn tương tự để copy layout)            | Nên có     |
| Wireframe / sketch / mockup                                      | Tốt nếu có |
| Design docs từ `feature-design` (`docs/features/<name>/`)        | Tốt nếu có |

## Quy trình 5 bước

### Bước 0: Xác định loại page

**Trước khi thiết kế, phân loại page.** Dựa vào data + UX để chọn đúng template:

| Page Type | Khi nào dùng                                              | Template           |
| --------- | --------------------------------------------------------- | ------------------ |
| `table`   | Danh sách dạng bảng, có cột, sort, pagination             | `templates/table/` |
| `tree`    | Dữ liệu phân cấp (tree structure), expand/collapse        | `templates/tree/`  |
| `form`    | Trang tạo/sửa, form là nội dung chính (không phải dialog) | `templates/form/`  |
| `cards`   | Danh sách dạng card (grid), không hiển thị bảng           | `templates/cards/` |

Nếu page kết hợp nhiều loại (vd: tree + table side by side) → chọn loại dominant, ghi chú phần phụ.

### Bước 1: Phân tích UX

Dùng kiến thức nội tại (không cần gọi skill phụ) để phân tích:

1. **Ai dùng page này?** → Quyết định mức độ phức tạp của UI
2. **Người dùng cần làm gì?** → Xác định primary action, secondary action
3. **Dữ liệu hiển thị thế nào?** → Table? Tree? Cards? Form?
4. **Có filter/search không?** → Filter bar design
5. **Có form create/edit không?** → Dialog hay inline?

Nếu cần phân tích sâu hơn về UX → gọi `impeccable` skill để review visual hierarchy, cognitive load, layout.

### Bước 2: Vẽ Mockup ASCII

**Đây là output quan trọng nhất.** Vẽ mockup ASCII cho toàn bộ page, theo style:

```
┌── Header ──────────────────────────────────────────────┐
│  [Icon] Tiêu đề                [Xuất CSV]  [+ Thêm mới] │
│  30 mặt hàng · 4 nhóm chính                              │
├── Filter Bar ───────────────────────────────────────────┤
│  [Danh mục: ▼ Tất cả]              [🔍 Tìm vật tư...  ] │
├── Content ──────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐│
│  │ SKU       │ Tên          │ Danh mục  │ Đơn vị │ ... ││
│  ├───────────┼──────────────┼───────────┼────────┼─────┤│
│  │ XM-PC40   │ Xi măng PC40 │ Xi măng   │ Bao    │ ... ││
│  │ THEP-D10  │ Thép D10     │ Sắt, thép │ Cây    │ ... ││
│  │ ...       │ ...          │ ...       │ ...    │ ... ││
│  └─────────────────────────────────────────────────────┘│
├── Footer ───────────────────────────────────────────────┤
│  25 / 30 dòng                          ◀ 1 / 2 ▶       │
└─────────────────────────────────────────────────────────┘
```

**Nguyên tắc vẽ mockup:**

- Dùng ký tự Unicode box-drawing: `─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼`
- Icon bằng emoji hoặc placeholder `[Icon]`
- Input/search: `[🔍 placeholder...]`
- Select/dropdown: `[Label: ▼ Giá trị]`
- Button: `[Tên nút]` (primary), `(Tên nút)` (secondary/disabled)
- Text nhỏ/muted: chữ thường, không đậm
- Comment bên phải bằng `←` nếu cần giải thích
- **Luôn hiển thị ít nhất 2-3 dòng dữ liệu mẫu** trong table/tree
- Chú thích role/permission (nếu có) dùng `← Admin only`

### Bước 3: Dựng cây component + State Flow

Sau khi có mockup, dựng cây component và bảng state flow (dùng template tương ứng với loại page).

### Bước 4: Chọn components

Luôn ưu tiên component từ codebase + shadcn/ui:

| Loại UI           | Component             | Nguồn                                   |
| ----------------- | --------------------- | --------------------------------------- |
| Button            | `Button`              | `@/components/ui/button`                |
| Input             | `Input`               | `@/components/ui/input`                 |
| Select / Dropdown | `Select`              | `@/components/ui/select`                |
| Table             | `DataTable`           | `@/components/ui/data-table`            |
| Pagination        | `DataTablePagination` | `@/components/ui/data-table-pagination` |
| Badge / Tag       | `Badge`               | `@/components/ui/badge`                 |
| Dialog / Modal    | `Dialog`              | `@/components/ui/dialog`                |
| Icons             | `HugeiconsIcon`       | `@hugeicons/react`                      |

### Form fields — luôn dùng `@/components/form/`

Khi code form (trong dialog hoặc trang form), **luôn ưu tiên** các field component từ `@/components/form/` thay vì dùng `<Input>` trần:

| Field type         | Component         | Nguồn                               |
| ------------------ | ----------------- | ----------------------------------- |
| Text input         | `InputField`      | `@/components/form/InputField`      |
| Textarea           | `TextareaField`   | `@/components/form/TextareaField`   |
| Select/Dropdown    | *(sắp có)*        | `@/components/form/`                |
| Number input       | *(sắp có)*        | `@/components/form/`                |
| Date picker        | *(sắp có)*        | `@/components/form/`                |

**Pattern dùng `InputField`:**

```tsx
import { InputField } from "@/components/form/InputField";

<InputField
  of={form}
  path="code"
  label="Mã danh mục"
  placeholder="VD: VLXD"
  required
/>
```

**Props chuẩn:** `of` (FormStore), `path` (field path), `label`, `placeholder`, `description`, `required`, `disabled`.

Nếu cần `transform` (vd: string → number cho field nullable number):

```tsx
<InputField
  of={form}
  path="parentId"
  label="Danh mục cha"
  transform={(v) => (v === "" ? null : Number(v))}
/>
```

Nếu cần component không có sẵn → gọi `shadcn` skill để add base component, rồi wrap thành Field component theo pattern của `InputField`.

### Bước 5: Chờ duyệt + Triển khai

1. Trình bày **mockup ASCII + component tree + state flow** cho user
2. Hỏi user: "Có muốn thay đổi gì không?"
3. Sau khi duyệt → code từng file từ trên xuống dưới

---

## Cấu trúc file page

Mỗi page trong `src/app/(app)/<route>/` tách thành các file riêng. Cấu trúc thay đổi theo loại page.

### Dạng `table`

```
src/app/(app)/<route>/
├── page.tsx          ← Container: state, data fetching, layout
├── header.tsx        ← Tiêu đề + stats + actions
├── filter-bar.tsx    ← Filters + search
├── table-section.tsx ← Bọc DataTable
├── columns.tsx       ← Column definitions
├── footer.tsx        ← Pagination
├── create-dialog.tsx ← Dialog tạo mới (nếu có)
└── edit-dialog.tsx   ← Dialog chỉnh sửa (nếu có)
```

### Dạng `tree`

```
src/app/(app)/<route>/
├── page.tsx          ← Container: state, data fetching, layout
├── header.tsx        ← Tiêu đề + stats + actions
├── filter-bar.tsx    ← Filters + search (nếu có)
├── tree-section.tsx  ← Bọc tree component
├── tree-node.tsx     ← Node đệ quy (expand/collapse)
├── footer.tsx        ← Summary/actions (không pagination)
├── create-dialog.tsx ← Dialog tạo mới
└── edit-dialog.tsx   ← Dialog chỉnh sửa
```

### Dạng `form`

```
src/app/(app)/<route>/
├── page.tsx          ← Container: form state, mutation
├── header.tsx        ← Tiêu đề + actions (Save, Cancel)
├── form-section.tsx  ← Form fields layout
├── form-field-*.tsx  ← Custom field components (nếu cần)
└── page-actions.tsx  ← Submit/Cancel buttons
```

> Luôn tách tối thiểu: `page.tsx`, `header.tsx`.

---

## Layout nguyên tắc

Container ngoài cùng luôn dùng:

```
flex h-full min-h-0 max-h-full flex-col
```

Phân vùng:

- Header + FilterBar: `shrink-0` (không co lại)
- Content: `flex-1 min-h-0 overflow-auto` (co giãn + scroll)
- Footer: `shrink-0`

## Tích hợp với skill khác

Khi cần phân tích UI chuyên sâu, gọi sub-agent:

- **`impeccable`** — Review visual hierarchy, layout, cognitive load, accessibility, empty states, error states, UX copy.
- **`shadcn`** — Khi cần component từ shadcn registry chưa có trong project.

Không gọi mặc định — chỉ gọi khi cần phân tích sâu hoặc cần component mới.

## Ví dụ page đã làm

Xem `src/app/(app)/materials/` — page Materials dạng `table`, triển khai đúng chuẩn.
