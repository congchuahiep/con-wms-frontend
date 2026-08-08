---
name: feature-design
description: "Design-first cho data layer của feature mới trong con-wms-frontend. Tạo design docs (data model, API spec, implementation checklist) TRƯỚC KHI code types/schemas/services. Dùng khi user yêu cầu 'thêm feature X', 'tạo API service Y', 'thiết kế data layer cho Z'."
---

# Feature Design — con-wms-frontend

Quy trình bắt buộc khi thiết kế tầng dữ liệu cho bất kỳ feature mới nào trong dự án con-wms-frontend.

## Vai trò

Skill này chỉ giải quyết **data layer**. Nó trả lời câu hỏi:
- Feature này nhận/trả về dữ liệu gì?
- Validation rules gì?
- Gọi API endpoint nào?

Skill này **KHÔNG** giải quyết UI. Sau khi skill này hoàn tất → dùng skill `page-design` để thiết kế UI.

## Đầu vào cần có

Trước khi bắt đầu, xác nhận với user rằng đã có:

| Mục | Trạng thái |
|---|---|
| API spec từ backend (endpoint, request/response shape) | Bắt buộc |
| Quyền hạn (ai được gọi API này?) | Nên có |
| Mock data mẫu (nếu API chưa sẵn sàng) | Tốt nếu có |

Nếu backend có design doc từ `entity-workflow` → đọc `docs/entities/<name>/api.md` và `docs/entities/<name>/model.md` làm đầu vào.

## Quy trình 5 bước

### Bước 1: Phân tích + Thiết kế

Tạo thư mục `docs/features/<feature-name>/` với các file sau:

| File | Bắt buộc? | Nội dung |
|---|---|---|
| `README.md` | ✅ | Index trỏ đến các file con, scope, trạng thái, mapping đến backend entity |
| `data-model.md` | ✅ | TypeScript types, enums, color maps, helpers, quan hệ giữa các type |
| `api-spec.md` | ✅ | API endpoints consumed, request/response shape, query params, error cases |
| `implementation.md` | ✅ | Checklist triển khai dạng checkbox: types → schemas → services → endpoints → query keys |
| `change-log.md` | ✅ | Lịch sử phiên bản thiết kế |

> **Đặt tên feature:** Dùng tên resource chính, số ít. VD: `material-category`, `unit`, `inbound-note`. Khớp với tên folder trong `src/features/`.

Sau khi viết xong, tạo (hoặc cập nhật) `docs/features/README.md` để thêm feature vào index.

### Bước 2: Validate (Context7)

Trước khi đề xuất code, tra cứu Context7 các library liên quan:

- Valibot schemas → resolve `/fabian-hiller/valibot`
- TanStack Query v5 (useQuery, useMutation) → resolve `/tanstack/query`
- Formisch + usePost (project-specific) → đọc `src/hooks/usePost.ts`
- Axios patterns → không cần Context7

Ghi nhận kết quả validate vào `change-log.md`.

### Bước 3: Chờ user duyệt

**Không code khi chưa có xác nhận từ user.** Trình bày thiết kế, hỏi:
- Types có đầy đủ không?
- Schema validation có hợp lý không?
- API mapping có đúng không?

Chỉ code sau khi user đồng ý.

### Bước 4: Triển khai + Check off

Code theo đúng thứ tự trong `implementation.md`:

1. **`types.ts`** — Định nghĩa tất cả types. **Chỉ chứa type definitions** (type alias, union). Không chứa runtime code.
2. **`utils.ts`** — Runtime code: color maps, helper functions (vd: `getCategoryColorClass()`), constant objects. Export từ `types.ts` các type cần dùng.
3. **`schemas.ts`** — Valibot schemas cho form (POST/PATCH). Chỉ validate field client gửi lên. Dùng `v.pipe()` cho validation chains.
4. **`services.ts`** — TanStack Query hooks:
   - `useQuery` cho GET list/detail
   - `usePost` wrapper cho POST create
   - `usePartialUpdate` wrapper cho PATCH/update
   - `useMutation` cho DELETE
5. **`src/configs/endpoints.ts`** — Thêm endpoint vào `authEndpoints`. Dynamic URL dùng arrow function: `update: (id) => \`/resource/${id}/\``.
6. **`src/configs/querykeys.ts`** — Thêm query keys: `all`, `list()`, `detail(id)`.
7. **`index.ts`** — Barrel export: `types`, `schemas`, `services`, `utils`.

Sau mỗi mục hoàn thành, đánh dấu `[x]` trong checklist.

### Bước 5: Cập nhật docs sau khi code

Sau khi toàn bộ code đã hoàn thành (tất cả phase), **bắt buộc** cập nhật lại design docs để phản ánh trạng thái cuối cùng:

- **`README.md`** — cập nhật trạng thái scope: `🔵 Đang thiết kế` → `✅ Hoàn thành`. Liệt kê tất cả thành phần đã triển khai.
- **`api-spec.md`** — thêm các endpoint đã triển khai sau thiết kế ban đầu (PUT, DELETE, ...). Cập nhật request/response mẫu.
- **`implementation.md`** — check off tất cả các mục đã hoàn thành trong tất cả phase.
- **`change-log.md`** — thêm entry cho phiên bản cuối, ghi nhận tất cả thay đổi.
- **`docs/features/README.md`** — cập nhật trạng thái feature trong index.

## Cấu trúc code chuẩn

```
src/features/<name>/
├── types.ts       ← Chỉ type definitions (type alias, union, interface cho props)
├── utils.ts       ← Runtime: color maps, helper functions, constants
├── schemas.ts     ← Valibot validation schemas (POST/PATCH body)
├── services.ts    ← TanStack Query hooks (useQuery, usePost, usePartialUpdate, useMutation)
└── index.ts       ← Barrel export
```

### Pattern: types.ts

```typescript
// Dùng type alias cho data shapes, KHÔNG dùng interface
// Interface chỉ dùng cho React component props
// Tên: PascalCase, khớp với response JSON keys (camelCase)

export type MaterialCategory = {
  id: number;
  code: string;
  name: string;
  description: string;
  color: string | null;
  parent: number | null;
  children: MaterialCategory[];
  isActive: boolean;
};

// Union type cho enum-like values (client kiểm soát danh sách)
export type MaterialCategoryColor =
  | "red" | "orange" | "yellow" | "green" | "teal"
  | "blue" | "indigo" | "purple" | "pink" | "gray";
```

### Pattern: utils.ts

```typescript
// Runtime code tách riêng khỏi types.ts
import type { MaterialCategoryColor } from "./types";

export const CATEGORY_COLOR_MAP: Record<MaterialCategoryColor, string> = {
  red: "bg-red-100 text-red-700 border-red-300",
  orange: "bg-orange-100 text-orange-700 border-orange-300",
  // ...
};

export function getCategoryColorClass(color: string | null): string {
  if (!color) return "bg-muted text-muted-foreground border-border";
  return CATEGORY_COLOR_MAP[color as MaterialCategoryColor]
    ?? "bg-muted text-muted-foreground border-border";
}
```

### Pattern: schemas.ts

```typescript
import * as v from "valibot";
// KHÔNG dùng `import type` — v.partial(), v.object() cần runtime

export const CategorySchema = v.object({
  code: v.pipe(
    v.string("Mã danh mục phải là chuỗi"),
    v.nonEmpty("Mã danh mục không được để trống"),
    v.regex(/^[a-zA-Z0-9_]+$/, "Mã danh mục chỉ được chứa chữ cái, số và dấu gạch dưới"),
    v.maxLength(50, "Mã danh mục tối đa 50 ký tự"),
  ),
  name: v.pipe(
    v.string("Tên danh mục phải là chuỗi"),
    v.nonEmpty("Tên danh mục không được để trống"),
    v.maxLength(200, "Tên danh mục tối đa 200 ký tự"),
  ),
  description: v.optional(v.string(), ""),
  color: v.optional(v.nullable(v.string()), null),
  parentId: v.optional(v.nullable(v.number()), null),
});
```

### Pattern: services.ts

```typescript
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/configs/api";
import { categoryKeys } from "@/configs/querykeys";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import {
  type UsePartialUpdateOptions,
  usePartialUpdate,
} from "@/hooks/usePartialUpdate";
import { CategorySchema } from "./schemas";
import type { MaterialCategory } from "./types";

// GET list
export function useGetCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: async () => {
      const response = await authApi.get<MaterialCategory[]>(
        (ep) => ep.categories.list,
      );
      return response.data;
    },
  });
}

// POST create — dùng usePost
export function useAddCategory(
  options?: Omit<UsePostOptions<typeof CategorySchema>, "schema" | "mutationFn">,
) {
  const queryClient = useQueryClient();
  return usePost({
    ...options,
    schema: CategorySchema,
    initialInput: { code: "", name: "", description: "", color: null, parentId: null },
    mutationFn: async (data) => {
      const response = await authApi.post<MaterialCategory>(
        (ep) => ep.categories.create, data,
      );
      return response.data;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all, exact: false });
      options?.onSuccess?.(...args);
    },
  });
}

// PATCH update — dùng usePartialUpdate, chỉ gửi field thay đổi
export function useUpdateCategory(
  id: number,
  initialInput: Partial<v.InferOutput<typeof CategorySchema>>,
  options?: Omit<UsePartialUpdateOptions<typeof CategorySchema, MaterialCategory>,
    "schema" | "mutationFn" | "initialInput" | "id">,
) {
  return usePartialUpdate({
    ...options,
    schema: CategorySchema,
    id,
    initialInput,
    mutationFn: async ({ id, ...data }) => {
      const response = await authApi.patch<MaterialCategory>(
        (ep) => ep.categories.update(id as number),
        data,
      );
      return response.data;
    },
    invalidateKeys: categoryKeys.all,
  });
}

// DELETE
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation<MaterialCategory, AppError, number>({
    mutationFn: async (id) => {
      const response = await authApi.delete<MaterialCategory>(
        (ep) => ep.categories.delete(id),
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all, exact: false });
    },
  });
}
```

### Pattern: endpoint config (dynamic URLs)

```typescript
// Trong src/configs/endpoints.ts → authEndpoints
// Dynamic URL dùng arrow function, nhận id trả về string
categories: {
  list: "/categories/",
  create: "/categories/",
  update: (id: number) => `/categories/${id}/`,
  delete: (id: number) => `/categories/${id}/`,
},
```

### Pattern: query keys

```typescript
export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  detail: (id: number) => [...categoryKeys.all, "detail", id] as const,
};
```

## Conventions

- **`types.ts` chỉ chứa type** — runtime code (map, helper, constant) → `utils.ts`
- **`import * as v from "valibot"`** — KHÔNG dùng `import type` vì cần `v.partial()`, `v.object()` runtime
- **Schema tên `XxxSchema`** — không prefix `Create`/`Update`; edit form dùng `usePartialUpdate` tự tạo partial
- **Update luôn dùng PATCH** — `authApi.patch()` + `usePartialUpdate` hook, chỉ gửi field bị thay đổi (dirty tracking)
- **Dynamic endpoint URL** — dùng arrow function trong config object

## Ví dụ feature đã làm

Xem `src/features/material-category/` — Material Category đã triển khai đúng chuẩn.
Xem `docs/features/material-category/` — Design docs đầy đủ.
