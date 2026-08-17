# Change Log — Stock (Tồn kho & Sổ kho)

## v1.2 — 2026-08-14 — Đổi tên enum theo backend v1.2

Nguồn: backend [`../../../con-wms/docs/entities/stock/frontend-migration.md`](../../../con-wms/docs/entities/stock/frontend-migration.md)

| # | Nội dung |
|---|---|
| 1 | `MovementType` đổi 6 giá trị: `inbound_purchase` → `inbound_purchase_from_supplier`, `inbound_return` → `inbound_return_from_site`, `outbound_use` → `outbound_issue_for_use`, `transfer_out` → `outbound_transfer_to_warehouse`, `transfer_in` → `inbound_transfer_from_warehouse`, `stocktake_adjust` → `stocktake_adjustment`. |
| 2 | `MOVEMENT_TYPE_COLOR_MAP` key mới; `MOVEMENT_TYPE_LABELS` (filter sổ kho) đồng bộ label mới với API. |
| 3 | Hiển thị badge/cột vẫn dùng `movementTypeLabel` từ API — không hardcode label trong UI. |

**Validation:** `tsc --noEmit` ✅ + `biome check` trên các file đổi ✅

## v1.1 — 2026-08-13 — Đã triển khai UI

| # | Nội dung |
|---|---|
| 1 | **Tồn kho `/inventory`**: thay mock bằng `useGetStockBalances` — filters server-side (danh mục flatten tree, kho, tồn `hasStock`, search), table client-side sort, footer tổng dòng + tổng giá trị. Bỏ tabs mock ("Sắp hết" chờ backend StockAlert). |
| 2 | **Sổ kho `/stock-movements`** (mới): phân trang server-side (pageSize 50), filters (kho, loại dòng, vật tư combobox, ngày từ/đến, switch "Hiện dòng hủy" → `originalsOnly`), badge màu theo loại dòng, cột reversal + lý do. |
| 3 | `stock/utils.ts` thêm `MOVEMENT_TYPE_LABELS` + `MOVEMENT_TYPES` (filter loại dòng). |
| 4 | `MaterialCombobox`/`MaterialSelectField` (feature material) — combobox search server-side debounce 300ms, cache merge `initialItems`. |
| 5 | Sidebar thêm "Sổ kho" (nhóm Nghiệp vụ). |

**Validation:** `tsc --noEmit` ✅ + `biome check` ✅ + `next build` ✅

## v1.0 — 2026-08-13 — Đã triển khai data layer

Code đúng thiết kế v0.2, không lệch thiết kế:

- `src/features/stock/types.ts` — `MovementType`, `StockBalance`, `StockMovement`, params camelCase
- `src/features/stock/utils.ts` — `MOVEMENT_TYPE_COLOR_MAP`, `getMovementTypeColorClass`, `formatSignedQuantity`
- `src/features/stock/services.ts` — `useGetStockBalances`, `useGetStockMovements` (read-only, không mutation)
- `src/configs/endpoints.ts` — `stock.balances`, `stock.movements`
- `src/configs/querykeys.ts` — `stockKeys` (prefix chung `["stock"]`)
- Simple types ở feature sở hữu: `SimpleMaterial` (material), `SimpleWarehouse` (warehouse), `SimpleUser` (auth); reuse `SimpleUnit`

**Validation:** `tsc --noEmit` ✅ + `biome check` trên các file đổi ✅

## v0.2 — 2026-08-13 — Theo phản hồi duyệt thiết kế

| # | Nội dung |
|---|---|
| 1 | Đổi `MaterialRef`/`WarehouseRef`/`UnitRef`/`UserRef` → **`SimpleMaterial`/`SimpleWarehouse`/`SimpleUnit`/`SimpleUser`** theo quy chuẩn dự án (`SimpleMaterialCategory`). Simple types đặt ở **feature sở hữu**, `SimpleUnit` reuse từ feature `unit`. |
| 2 | Query params chuyển sang **camelCase** (`hasStock`, `movementType`, `dateFrom`…) — backend xác nhận đã normalize camelCase. |
| 3 | **OQ-1 đã chốt:** phân trang trả `{items, meta}` — dùng `Paginated<T>`; doc backend ghi `{count, results}` là lộn. |
| 4 | **OQ-3:** nút hiện dòng reversal chuyển thành UI concern cho skill `page-design`. |

## v0.1 — 2026-08-13 — Thiết kế ban đầu

**Nguồn đầu vào:**

- Backend `docs/entities/stock/model.md` (model `StockMovement`, D1–D10)
- Backend `docs/entities/stock/api.md` (2 endpoint read-only)
- Backend `docs/entities/stock/auth.md` (IsAuthenticated, không có write)
- Frontend convention: `docs/features/supplier/` + `src/features/material*/`

**Quyết định chính:**

| # | Nội dung |
|---|---|
| 1 | Feature **read-only**: không `schemas.ts`, không mutation — khớp stock D9 |
| 2 | Decimal giữ nguyên **string** (`"85.000"`, `"88000.00"`) |
| 3 | Ref types local (`MaterialRef`, `WarehouseRef`, `UnitRef`, `UserRef`) |
| 4 | 2 query keys gộp chung prefix `["stock"]` để inbound-note dễ invalidate |
| 5 | `utils.ts` có color map + `formatSignedQuantity` |
| 6 | Flag OQ-1: shape phân trang cần xác nhận với backend |

**Validate Context7 (2026-08-13):**

- **Valibot** (`/websites/valibot_dev`) — không dùng schema nào cho feature này (read-only); đã xác nhận sẵn các API `v.isoDate`, `v.decimal`, `v.check`, `v.minLength` cho feature `inbound-note`.
- **TanStack Query v5** (`/tanstack/query`) — xác nhận pattern `useQuery({queryKey, queryFn})` object signature, `invalidateQueries` prefix match mặc định `exact: false` — khớp pattern đang dùng trong repo (`material/services.ts`).

**Open questions:** OQ-1/OQ-2/OQ-3 — đã giải quyết ở v0.2.
