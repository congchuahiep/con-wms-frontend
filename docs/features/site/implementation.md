# Implementation Checklist — Site (Công trường)

## Data layer ✅

- [x] `types.ts` — Site, SimpleSite, SiteInput, GetSitesParams
- [x] `utils.ts` — toSiteInput()
- [x] `schemas.ts` — SiteSchema (valibot: code/name bắt buộc, manager/phone/address/note optional)
- [x] `services.ts` — useGetSites (filteredList), useGetSite, useAddSite, useUpdateSite (PATCH partial), useDeleteSite (soft delete)
- [x] `endpoints.ts` — authEndpoints.sites: list, create, detail, update, delete
- [x] `querykeys.ts` — siteKeys: all, list(), filteredList(), detail()
- [x] `index.ts` — barrel export (schemas, services, types, utils)

## UI (page-design) — chờ triển khai

Checklist UI nằm ở [`page-design.md`](./page-design.md) — chưa triển khai.

- [ ] `src/app/(app)/sites/` — table + header/filter/columns/table-section/footer/params
- [ ] Create/Edit dialog (`useAddSite`, `useUpdateSite`)
- [ ] Delete confirm dialog (soft delete)
- [ ] Sidebar nav

## Kết quả validate

| Check | Kết quả |
|---|---|
| TypeScript (`bunx tsc --noEmit`) | ✅ Pass |
| Biome (`bunx biome check src/features/site`) | ✅ Pass |