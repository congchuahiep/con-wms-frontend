# Implementation Checklist — Notes (Chứng từ kho)

## Phase 1 — Component UI dùng chung (nhỏ, thuần UI)

- [ ] `NoteTypeTabs` — 3 link điều hướng, active theo `usePathname()`
- [ ] `NoteStatusTabs` — 3 button trạng thái, ghi `status` vào search param

## Phase 2 — Hub `/notes`

- [ ] `src/app/(app)/notes/page.tsx` — 3 card loại phiếu (pha 1: không stats)
- [ ] Sidebar: 1 mục "Chứng từ kho" → `/notes`

## Phase 3 — `/notes/inbound` (page độc lập)

- [ ] Copy cấu trúc `src/app/(app)/inbound-notes/` → `src/app/(app)/notes/inbound/`
- [ ] Thêm `NoteTypeTabs` trên đầu page
- [ ] Thay status `Select` bằng `NoteStatusTabs`
- [ ] Bỏ cột `Trạng thái` trong `columns.tsx`; giữ các cột còn lại
- [ ] Giữ nguyên `/inbound-notes` cũ để đối chiếu

## Phase 4 — `/notes/outbound` (chờ backend)

- [ ] Backend design `outbound-note` (entity-workflow)
- [ ] `features/outbound-note` data layer (types/schemas/services)
- [ ] Copy cấu trúc page + config theo outbound

## Phase 5 — `/notes/stocktake` (chờ backend)

- [ ] Backend design `stocktake` (entity-workflow)
- [ ] `features/stocktake-note` data layer
- [ ] Copy cấu trúc page + config theo stocktake

## Phase 6 — Stats hub (tuỳ chọn)

- [ ] Endpoint `GET /notes/stats/` (hoặc aggregate client)
- [ ] Hiển thị `total` / `draft` trên 3 card hub

## Validation

- [ ] Context7 validate trước khi code data layer của outbound/stocktake
- [ ] Typecheck + biome check + `next build`
