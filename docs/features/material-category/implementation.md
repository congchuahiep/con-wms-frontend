# Implementation Checklist — Material Category

> **Scope hiện tại:** Chỉ GET (hiển thị). POST/PUT/DELETE deferred.

## Types

- [x] `src/features/material-category/types.ts`: định nghĩa tất cả interfaces/types
    - `MaterialCategory` — response từ API (tree, có `children: MaterialCategory[]`)
    - `FlatCategory` — dạng phẳng (dùng sau này với `?flat=true`)
    - `MaterialCategoryColor` — union type 22 màu
    - `CATEGORY_COLOR_MAP` — Record map màu → Tailwind class
    - `getCategoryColorClass()` — helper lấy Tailwind class từ color string

## Schemas (Valibot)

- [x] Chưa cần — không có POST/PUT trong scope hiện tại
    - Sẽ thêm sau: `CreateCategorySchema`, `UpdateCategorySchema`

## Services (TanStack Query)

- [x] `useGetCategories()` — `useQuery` GET `/api/categories/`, trả về `MaterialCategory[]`
- [x] Không cần `useMutation` nào trong scope hiện tại

> **Ghi chú Context7 validation (2026-08-07):** TanStack Table v8 hỗ trợ tree qua `getSubRows: (row) => row.children`. Không cần flatten thủ công. `row.depth` tự động có, dùng để indent. Tham khảo: `enableExpanding`, `getRowCanExpand`, `getSubRows`.

## Endpoints config

- [x] `src/configs/endpoints.ts` → `authEndpoints.categories.list: "/categories/"`

## Query keys

- [x] `src/configs/querykeys.ts` → `categoryKeys`
    - `all: ["categories"]`
    - `list: () => [...all, "list"]`

## Barrel export

- [x] `src/features/material-category/index.ts`: export `types`, `services`
    - Không export `schemas` (chưa có)

## Helper hooks (cho UI layer)

- [x] Không cần custom hook flatten — TanStack Table xử lý tree qua `getSubRows`
- [x] Search/filter: `useState` + `useMemo` lọc `MaterialCategory[]` theo `name`/`code` trước khi đưa vào table (client-side, ≤ 30 items)
