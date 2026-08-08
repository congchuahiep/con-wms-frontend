# Create Dialog Design — Material Category

> **Ngày:** 2026-08-07
> **Scope:** Dialog tạo mới danh mục, trigger từ nút "Thêm danh mục vật tư" trên header
> **Phase:** v1.2 — POST/CREATE

---

## 1. Mockup

```
┌── Create Dialog ──────────────────────────────────────────────────┐
│  Thêm danh mục vật tư                                    [✕]     │
│  Tạo danh mục mới để phân loại vật tư                              │
│                                                                    │
│  Mã danh mục *                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ VD: VLXD                                                     │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Tên danh mục *                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Vật liệu xây dựng                                            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Mô tả                                                             │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Nhóm vật liệu thô dùng trong xây dựng                        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Danh mục cha                                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ (Không có)                                          ▼        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  Màu sắc                                                           │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ (Không có)                                          ▼        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│                        (Hủy)              [Thêm danh mục vật tư]   │
└────────────────────────────────────────────────────────────────────┘
```

> `*` = required field. `(Hủy)` = secondary/outline button. `[Thêm]` = primary button, disabled nếu form invalid hoặc isPending.

---

## 2. Component Tree

```
CreateCategoryDialog
└── Dialog (shadcn)
    └── DialogContent
        ├── DialogHeader
        │   ├── DialogTitle: "Thêm danh mục vật tư"
        │   └── DialogDescription: "Tạo danh mục mới để phân loại vật tư"
        ├── Form (Formisch <Form of={form} onSubmit={handleSubmit}>)
        │   ├── InputField of={form} path="code"        ← required, regex /^[a-zA-Z0-9_]+$/
        │   ├── InputField of={form} path="name"        ← required
        │   ├── TextareaField of={form} path="description" ← optional
        │   ├── SelectField of={form} path="parentId"   ← optional, tree data
        │   └── SelectField of={form} path="color"      ← optional, 10 màu
        └── DialogFooter
            ├── Button "Hủy"           ← variant outline, onClick = close
            └── Button "Thêm danh mục" ← type submit, disabled khi isPending
```

---

## 3. State Flow

| State               | Vị trí                           | Props                                       |
| ------------------- | -------------------------------- | ------------------------------------------- |
| `open`              | `page.tsx` (`useState<boolean>`) | `CreateCategoryDialog.open`, `onOpenChange` |
| `categories` (tree) | `useGetCategories()` — đã có sẵn | `CreateCategoryDialog` → `ParentSelect`     |
| `form`              | `useAddCategory()` trong dialog  | Formisch `<Form of={form}>`                 |
| `isPending`         | `useAddCategory().isPending`     | Submit button disabled + loading            |
| `handleSubmit`      | `useAddCategory().handleSubmit`  | `<Form onSubmit={handleSubmit}>`            |

### Dialog open/close flow

```
page.tsx
  useState open=false
    ↓
header.tsx button "Thêm" onClick → setOpen(true)
    ↓
CreateCategoryDialog renders
    ↓
useAddCategory() called inside dialog → form initialized
    ↓
User fills form → Submit
    ↓
onSuccess → invalidateQueries → setOpen(false) → form auto-reset
```

---

## 4. Field Spec

### 4.1 Mã danh mục (`code`)

- Component: `InputField`
- Schema: required, regex `/^[a-zA-Z0-9_]+$/`, max 50
- Placeholder: `VD: VLXD`

### 4.2 Tên danh mục (`name`)

- Component: `InputField`
- Schema: required, max 200
- Placeholder: `Vật liệu xây dựng`

### 4.3 Mô tả (`description`)

- Component: `TextareaField`
- Schema: optional, default `""`
- Placeholder: `Nhóm vật liệu thô dùng trong xây dựng`

### 4.4 Danh mục cha (`parentId`)

- Component: `SelectField` (cần tạo mới)
- Schema: optional, `number | null`, default `null`
- Data source: `useGetCategories()` → tree `MaterialCategory[]`
- Transform: client-side flatten tree → `{ value: id, label: name, depth }`
- Hiển thị: label có indent = `depth × 1.5rem`
- Option mặc định: `(Không có)` → value `null`

### 4.5 Màu sắc (`color`)

- Component: `SelectField` (cần tạo mới)
- Schema: optional, `string | null`, default `null`
- Options: 10 màu từ `MaterialCategoryColor`
- Mỗi option hiển thị: chấm tròn màu + tên màu
- Option mặc định: `(Không có)` → value `null`

---

## 5. New Dependencies

### 5.1 SelectField component

Cần tạo `src/components/form/SelectField.tsx` — theo pattern của `InputField`:

```tsx
// Interface (dự kiến)
interface SelectFieldProps<TSchema, TFieldPath> {
  of: FormStore<TSchema>;
  path: ValidPath<...>;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  options: Array<{ value: string; label: string }>;
  transform?: (value: string) => PathValue<...>;
  renderOption?: (option) => ReactNode;  // cho custom render (color dot)
}
```

### 5.2 Color picker via SelectField

Mỗi option trong color SelectField render:

```
[●] Đỏ
[●] Cam
[●] Vàng
...
```

Dùng `renderOption` prop tùy chỉnh render item.

### 5.3 Parent select via SelectField

Flatten tree client-side:

```ts
function flattenForSelect(
    nodes: MaterialCategory[],
    depth = 0,
): { value: string; label: string; depth: number }[] {
    return nodes.flatMap((node) => [
        { value: String(node.id), label: node.name, depth },
        ...flattenForSelect(node.children, depth + 1),
    ]);
}
```

Option render với indent: `paddingLeft = depth × 1.5rem`

---

## 6. Data Layer Changes (đã code)

| File           | Thay đổi                                                               | Trạng thái |
| -------------- | ---------------------------------------------------------------------- | ---------- |
| `types.ts`     | + `description: string` vào `MaterialCategory` + `FlatCategory`        | ✅ Đã code |
| `schemas.ts`   | Mới: `CreateCategorySchema` (code, name, description, color, parentId) | ✅ Đã code |
| `services.ts`  | + `useAddCategory()` — `usePost` mutation                              | ✅ Đã code |
| `endpoints.ts` | + `categories.create: "/categories/"`                                  | ✅ Đã code |
| `index.ts`     | + export `schemas`                                                     | ✅ Đã code |

---

## 7. Data Layer Changes (cần sửa)

| File       | Thay đổi                                    |
| ---------- | ------------------------------------------- |
| `types.ts` | Giảm `MaterialCategoryColor` từ 22 → 10 màu |
| `utils.ts` | Giảm `CATEGORY_COLOR_MAP` từ 22 → 10 màu    |

### 10 màu mới

```typescript
export type MaterialCategoryColor =
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "teal"
    | "blue"
    | "indigo"
    | "purple"
    | "pink"
    | "gray";
```

---

## 8. UI Files to Create/Modify

| File                                                  | Action  | Nội dung                                      |
| ----------------------------------------------------- | ------- | --------------------------------------------- |
| `src/components/form/SelectField.tsx`                 | **Mới** | Reusable SelectField component                |
| `src/app/(app)/material-categories/create-dialog.tsx` | **Mới** | Dialog + form                                 |
| `src/app/(app)/material-categories/page.tsx`          | Sửa     | + `open` state, render `CreateCategoryDialog` |
| `src/app/(app)/material-categories/header.tsx`        | Sửa     | Enable nút "Thêm danh mục", `onAdd` prop      |

---

## 9. Implementation Order

```
1. Sửa types.ts + utils.ts (giảm 22 → 10 màu)
2. Tạo SelectField (src/components/form/SelectField.tsx)
3. Tạo create-dialog.tsx
4. Sửa header.tsx (enable button + onAdd prop)
5. Sửa page.tsx (wire dialog + state)
```

---

## 10. Quyết định thiết kế

| #   | Quyết định                                     | Lý do                                                                                                            |
| --- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| D8  | **Dùng SelectField cho cả parent + color**     | Nhất quán UX form. SelectField reusable cho toàn dự án. Tránh tạo ColorPicker component riêng.                   |
| D9  | **Giảm còn 10 màu**                            | 22 màu quá nhiều cho Select dropdown. 10 màu đủ phân biệt, bao phủ toàn spectrum.                                |
| D10 | **Flatten tree client-side cho parent select** | Không cần gọi thêm API `?flat=true`. Dùng `useGetCategories()` có sẵn, flatten trong component.                  |
| D11 | **SelectField có transform prop**              | Hỗ trợ string → number (parentId) hoặc string → null. Theo pattern InputField.                                   |
| D12 | **Dialog unmounts on close → form auto-reset** | `open ? <CreateCategoryDialog /> : null` → mỗi lần mở là form mới. Kết hợp `resetOnSuccess: true` của `usePost`. |
