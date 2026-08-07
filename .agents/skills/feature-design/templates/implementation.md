# Implementation Checklist — {{FEATURE_NAME}}

## Types

- [ ] `src/features/{{FEATURE_NAME}}/types.ts`: định nghĩa tất cả interfaces/types
    - Response type(s)
    - Request type(s) (nếu có)
    - Enum/union types (nếu có)

## Schemas (Valibot)

- [ ] `src/features/{{FEATURE_NAME}}/schemas.ts`: validation schemas
    - Schema cho form `POST` (create)
    - Schema cho form `PUT` (update) — nếu khác POST
    - Mỗi schema có message lỗi tiếng Việt, ngắn gọn

## Services (TanStack Query)

- [ ] `useQuery` cho GET list: `useGet{{PluralName}}()`
- [ ] `useQuery` cho GET detail: `useGet{{SingularName}}(id)` (nếu có trang detail)
- [ ] `usePost` cho POST form: `useAdd{{SingularName}}()` — kết hợp Formisch + Valibot + TanStack
- [ ] `useMutation` cho PUT: `useUpdate{{SingularName}}()` (nếu có)
- [ ] `useMutation` cho DELETE: `useDelete{{SingularName}}()` (nếu có)
- [ ] Invalidate query cache sau mỗi mutation thành công

## Endpoints config

- [ ] `src/configs/endpoints.ts` → `authEndpoints`: thêm endpoint mới

## Query keys

- [ ] `src/configs/querykeys.ts`: thêm query keys mới
    - `all` — base key
    - `list()` — list query
    - `detail(id)` — detail query (nếu có)

## Barrel export

- [ ] `src/features/{{FEATURE_NAME}}/index.ts`: export `types`, `schemas`, `services`
