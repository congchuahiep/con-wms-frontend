# Change Log — Site

## v1.1 — 2026-09-19

Triển khai UI (theo `page-design.md`).

- ✅ `src/app/(app)/sites/` — page container (`page.tsx`) + header/filter-bar/columns/table-section/footer/use-site-params
- ✅ Create dialog (`useAddSite`), Edit dialog (`useUpdateSite` + `toSiteInput`, pre-fill child mount, `w-lg`)
- ✅ Filter: search server-side + status select (`isActive` — Đang hoạt động/Đã vô hiệu hóa), theo pattern Select của inbound-notes
- ✅ Cột Ghi chú (note) bổ sung theo design — `size 220/160` (cột cuối là Actions nên note không thể "flexible")
- ✅ Soft delete qua `DeleteConfirmDialog`
- ✅ Sidebar nav "Công trường" (`/sites`, icon `ConstructionIcon`) — nhóm Nghiệp vụ (sau "Phiếu chứng từ"); chuyển từ Danh mục theo feedback user (công trường là nghiệp vụ, không phải danh mục vật tư)

### Kết quả validate

| Check | Kết quả |
|---|---|
| Biome (`bunx biome check src/app/(app)/sites`) | ✅ Pass (10 files incl. sidebar) |
| TypeScript (`bunx tsc --noEmit`) | ✅ Pass |

## v1.0 — 2026-09-19

Hoàn tất data layer + cập nhật docs trạng thái cuối.

- ✅ Data layer: `types.ts`, `schemas.ts`, `utils.ts` (toSiteInput), `services.ts`, `index.ts`
- ✅ Config: `endpoints.ts` (`sites.list/create/detail/update/delete`), `querykeys.ts` (`siteKeys`)
- ✅ `services.ts` — `useUpdateSite` đưa về chuẩn dự án: `initialInput: Partial<InferOutput<typeof SiteSchema>>`, bỏ cast `as never` (theo pattern `feature/unit`, `feature/supplier`)
- ✅ `index.ts` — sắp xếp barrel export theo alphabet (Biome organizeImports)
- ✅ Docs: `README.md` (trạng thái + mapping PATCH), `api-spec.md` (request/response mẫu), `implementation.md` (check off)

### Kết quả validate

| Check | Kết quả |
|---|---|
| Context7 — Valibot (`/open-circle/valibot`) | ✅ `v.pipe`, `v.optional(_, default)` → input `string \| undefined`, output `string` — khớp schema; `Partial<InferOutput>` hợp lệ cho `usePartialUpdate` |
| Context7 — TanStack Query (`/tanstack/query`) | ✅ `invalidateQueries({ queryKey, exact: false })` invalidate cả prefix — khớp pattern `siteKeys.all` trong services |
| Hooks project | ✅ `usePost` (schema + initialInput + onSuccess), `usePartialUpdate` (dirty tracking), `useMutation` — khớp signature |
| TypeScript (`bunx tsc --noEmit`) | ✅ Pass |
| Biome (`bunx biome check src/features/site`) | ✅ Pass (5 files, no fixes) |

## v0.2 — 2026-09-19

Triển khai data layer (commit `cd65621 feat(notes): add outbound, stocktake notes and site master`).

- ✅ `types.ts` — Site, SimpleSite, SiteInput, GetSitesParams
- ✅ `utils.ts` — toSiteInput()
- ✅ `schemas.ts` — SiteSchema (valibot)
- ✅ `services.ts` — useGetSites, useGetSite, useAddSite, useUpdateSite, useDeleteSite
- ✅ `endpoints.ts` — authEndpoints.sites
- ✅ `querykeys.ts` — siteKeys
- ✅ `index.ts` — barrel export

## v0.1 — 2026-08-20

Khởi tạo thiết kế từ backend site/api.md + model.md.

- Types: `Site`, `SimpleSite`, `SiteInput`, `GetSitesParams`
- Schema: 6 field form, `isActive`/`createdAt`/`updatedAt` chỉ đọc (không nằm trong schema)
- Không phân trang, search server-side `?search=`, filter `?is_active=` (default true)
- Update dùng `PATCH` + `usePartialUpdate`, soft delete qua `DELETE`