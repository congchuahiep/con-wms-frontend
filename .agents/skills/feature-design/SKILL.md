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

## Quy trình 4 bước

### Bước 1: Phân tích + Thiết kế

Tạo thư mục `docs/features/<feature-name>/` với các file sau (dùng template trong `templates/`):

| File | Bắt buộc? | Nội dung |
|---|---|---|
| `README.md` | ✅ | Index trỏ đến các file con, scope, trạng thái, mapping đến backend entity |
| `data-model.md` | ✅ | TypeScript interfaces, types, enums, quan hệ giữa các type |
| `api-spec.md` | ✅ | API endpoints consumed, request/response shape, query params, error cases |
| `implementation.md` | ✅ | Checklist triển khai dạng checkbox, theo đúng thứ tự: types → schemas → services → endpoints → query keys |
| `change-log.md` | ✅ | Lịch sử phiên bản thiết kế |

> **Đặt tên feature:** Dùng tên resource chính, số ít. VD: `material-category`, `unit`, `inbound-note`. Khớp với tên folder trong `src/features/`.

Sau khi viết xong, tạo (hoặc cập nhật) `docs/features/README.md` để thêm feature mới vào index.

### Bước 2: Validate (Context7)

Trước khi đề xuất code, tra cứu Context7 các library liên quan:

- TypeScript types, interfaces → không cần Context7
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

1. **`types.ts`** — định nghĩa tất cả interfaces/types
2. **`schemas.ts`** — Valibot schemas cho form (POST/PUT), chỉ những field client gửi lên
3. **`services.ts`** — TanStack Query hooks:
   - `useQuery` cho GET (list, detail)
   - `useMutation` cho POST/PUT/DELETE
   - `usePost` (custom hook) cho form POST/PUT kết hợp Formisch + Valibot
4. **`src/configs/endpoints.ts`** — thêm endpoint mới vào `authEndpoints`
5. **`src/configs/querykeys.ts`** — thêm query keys mới
6. **`index.ts`** — barrel export `types`, `schemas`, `services`

Sau mỗi mục hoàn thành, đánh dấu `[x]` trong checklist. Báo cáo done + remaining.

## Cấu trúc code chuẩn

Mỗi feature trong `src/features/<name>/` có cấu trúc:

```
src/features/<name>/
├── types.ts       ← TypeScript interfaces
├── schemas.ts     ← Valibot validation schemas
├── services.ts    ← TanStack Query hooks
├── index.ts       ← export * from ...
```

### Pattern: types.ts

```typescript
// Dùng interface (không type alias) cho response objects
// Dùng type alias cho unions, enums
// Tên: PascalCase, khớp với response JSON keys (camelCase)

export interface MaterialCategory {
  id: number;
  code: string;
  name: string;
  color: string | null;
  parent: number | null;
  children: MaterialCategory[];  // tree structure
  isActive: boolean;
}
```

### Pattern: schemas.ts

```typescript
import * as v from "valibot";

// Chỉ validate những field client gửi lên (POST/PUT body)
// KHÔNG validate id, createdAt, updatedAt, isActive (server-managed)
// Dùng v.optional() cho field không bắt buộc
// Dùng v.nullable() cho field có thể null
// Dùng v.pipe() để chain validation
// Message lỗi: tiếng Việt, ngắn gọn

export const CreateCategorySchema = v.object({
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
  color: v.optional(v.nullable(v.string()), null),
  parentId: v.optional(v.nullable(v.number()), null),
});
```

### Pattern: services.ts

```typescript
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/configs/api";
import { categoryKeys } from "@/configs/querykeys";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import { CreateCategorySchema } from "./schemas";
import type { MaterialCategory } from "./types";

// GET — list (không pagination, ≤ 30 items)
export function useGetCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: async () => {
      const response = await authApi.get<MaterialCategory[]>((ep) => ep.categories.list);
      return response.data;
    },
  });
}

// POST — create (dùng usePost = Formisch + Valibot + TanStack)
export function useAddCategory(
  options?: Omit<UsePostOptions<typeof CreateCategorySchema>, "schema" | "mutationFn">,
) {
  const queryClient = useQueryClient();

  return usePost({
    ...options,
    schema: CreateCategorySchema,
    initialInput: { code: "", name: "", color: null, parentId: null },
    mutationFn: async (data) => {
      const response = await authApi.post<MaterialCategory>((ep) => ep.categories.create, data);
      return response.data;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all, exact: false });
      options?.onSuccess?.(...args);
    },
  });
}
```

### Pattern: endpoint config

```typescript
// Trong src/configs/endpoints.ts → authEndpoints
categories: {
  list: "/categories/",
  create: "/categories/",
  // detail, update, delete thêm suffix {id} nếu có
}
```

### Pattern: query keys

```typescript
// Trong src/configs/querykeys.ts
export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  detail: (id: number) => [...categoryKeys.all, "detail", id] as const,
};
```

## Template files

Tất cả template nằm trong `templates/`. Khi tạo feature mới, copy template và điền nội dung cụ thể, xóa placeholder.

## Ví dụ feature đã làm

Xem `src/features/warehouse/` — feature Warehouse đã triển khai đúng chuẩn này.
