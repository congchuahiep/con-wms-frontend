# Edit Dialog Design — Material Category

> **Ngày:** 2026-08-07
> **Scope:** Dialog chỉnh sửa danh mục, trigger từ nút sửa trên mỗi dòng của table
> **Phase:** v1.3 — PUT/UPDATE

---

## 1. Mockup

```
┌── Edit Dialog ──────────────────────────────────────────────────┐
│  Sửa danh mục vật tư                                   [✕]     │
│  Chỉnh sửa thông tin danh mục "Vật liệu xây dựng"               │
│                                                                    │
│  Mã danh mục *                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ VLXD                                                         │ │
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
│  │ [●] Xanh dương                                     ▼        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│                        (Hủy)              [Lưu thay đổi]           │
└────────────────────────────────────────────────────────────────────┘
```

> Form pre-filled với giá trị hiện tại. Chỉ gửi field bị thay đổi. Submit button disabled nếu không có thay đổi hoặc isPending.

---

## 2. Component Tree

```
EditCategoryDialog
└── Dialog (shadcn)
    └── DialogContent
        ├── DialogHeader
        │   ├── DialogTitle: "Sửa danh mục vật tư"
        │   └── DialogDescription: 'Chỉnh sửa thông tin danh mục "{category.name}"'
        ├── Form (Formisch <Form of={form} onSubmit={handleSubmit}>)
        │   ├── InputField of={form} path={["code"]}        ← pre-filled, required
        │   ├── InputField of={form} path={["name"]}        ← pre-filled, required
        │   ├── TextareaField of={form} path={["description"]} ← pre-filled
        │   ├── SelectField of={form} path={["parentId"]}   ← pre-filled, tree
        │   └── SelectField of={form} path={["color"]}      ← pre-filled, 10 màu
        └── DialogFooter
            ├── Button "Hủy"              ← variant outline
            └── Button "Lưu thay đổi"     ← type submit, disabled khi !isDirty || isPending
```

---

## 3. State Flow

| State | Vị trí | Props |
|---|---|---|
| `editingCategory` | `page.tsx` (`useState<MaterialCategory \| null>`) | `EditCategoryDialog.category` |
| `dialogOpen` | Derived: `editingCategory !== null` | `EditCategoryDialog.open`, `onOpenChange` |
| `categories` (tree) | `useGetCategories()` | Parent select options |
| `form` | `usePartialUpdate()` trong dialog | `<Form of={form}>` |
| `isPending` | `usePartialUpdate().isPending` | Submit button disabled |
| `isDirty` | `usePartialUpdate().isDirty` | Submit button disabled |
| `handleSubmit` | `usePartialUpdate().handleSubmit` | `<Form onSubmit={handleSubmit}>` |

### Dialog open/close flow

```
Row click / edit button → setEditingCategory(category)
    ↓
EditCategoryDialog renders (open = category !== null)
    ↓
usePartialUpdate() với initialInput = category, id = category.id
    ↓
Form pre-filled. User chỉnh sửa → isDirty = true → button enabled
    ↓
Submit → chỉ gửi dirty fields + id → PUT /api/categories/{id}/
    ↓
onSuccess → invalidateQueries → setEditingCategory(null) → dialog closes
```

---

## 4. Data Layer Changes

### 4.1 Endpoint config

`src/configs/endpoints.ts` → `authEndpoints.categories`:

```typescript
categories: {
  list: "/categories/",
  create: "/categories/",
  // Không thêm update vào config — dùng trực tiếp trong mutationFn
}
```

> Update URL được construct inline vì cần `{id}` dynamic.

### 4.2 Không cần schema mới

`usePartialUpdate` tự tạo partial schema từ `CreateCategorySchema`. Không cần export schema riêng cho update.

---

## 5. UI Changes

### 5.1 Edit trigger trên table row

Thêm nút sửa (icon pencil) ở cuối mỗi row — hover hiện, hoặc luôn hiển thị.

Hai hướng:
- **A)** Thêm column "Thao tác" cuối bảng chứa icon button sửa
- **B)** Click vào row → mở edit dialog

Chọn **A** — rõ ràng, quen thuộc.

### 5.2 Columns

```
Tên danh mục | Mã | Màu sắc |           ← cột thao tác (mới)
─────────────────────────────────────────────────
▼ VLXD       | ...| [■ blue] | [✏️] [🗑️]     ← hover hiện
  ▶ Xi măng  | ...| [■ red]  | [✏️] [🗑️]
```

> Cột thao tác: minSize nhỏ (80px), flexible lấy phần dư.

---

## 6. Implementation Order

```
1. Sửa columns.tsx         ← thêm cột "Thao tác" + onEdit prop
2. Tạo edit-dialog.tsx     ← dialog + usePartialUpdate
3. Sửa page.tsx            ← editingCategory state, wire EditCategoryDialog
4. Sửa table-section.tsx   ← truyền onEdit xuống (nếu cần)
```

> `usePartialUpdate` đã port xong. Không cần thêm data layer.

---

## 7. Quyết định thiết kế

| # | Quyết định | Lý do |
|---|---|---|
| D13 | **Dùng `usePartialUpdate` cho edit** | Gửi PATCH-style: chỉ field thay đổi + id. Hook tự tạo partial schema, dirty tracking, invalidate cache. |
| D14 | **Không thêm schema riêng cho update** | `usePartialUpdate` nhận full schema `CreateCategorySchema` và tự `v.partial()`. |
| D15 | **Không thêm endpoint config `categories.update`** | URL cần `{id}` dynamic → construct inline trong mutationFn. |
| D16 | **Cột "Thao tác" tách riêng cuối bảng** | Rõ ràng UX. minSize nhỏ (80px), flexible lấy phần dư của table. |
| D17 | **Submit button disabled khi `!isDirty`** | Tránh gửi request rỗng. User phải thay đổi ít nhất 1 field. |
