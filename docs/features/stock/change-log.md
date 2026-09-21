# Change Log — Stock (Tồn kho & Sổ kho)

## v1.9 — 2026-09-20 — Số phiếu ở Sổ kho là link tới trang phiếu (deep-link search)

Kết hợp yêu cầu `notes` v0.3 (search sống trên URL `?search=`): bấm số phiếu ở cột "Phiếu" của Sổ kho sẽ **nhảy sang trang Phiếu nhập/xuất/kiểm kê tương ứng, đã search sẵn bằng mã phiếu**.

| # | Nội dung |
|---|---|
| 1 | `stock-movements/columns.tsx` — `sourceNote` render thành `Link` tới `SOURCE_NOTE_PATH[noteType]` = `/notes/inbound \| outbound \| stocktake` với `?search=<số phiếu>` (encode qua `URLSearchParams`). |
| 2 | Dòng reversal (`reversalOf != null`) là phiếu đã **HỦY** → kèm thêm `status=voided` để trang phiếu (mặc định "Đã chốt") không bỏ sót phiếu bị hủy. |
| 3 | Helper `sourceNoteHref(sourceNote, voided)` + const `SOURCE_NOTE_PATH: Record<SourceNoteType, string>` ở đầu file. |
| 4 | Deeps-link hoạt động nhờ `useUrlSearchParam` (notes v0.3): `?search=` tự điền ô tìm kiếm + lọc list, commit search → trang 1. |

**Validation:** `biome check` ✅ + `tsc --noEmit` ✅ + `next build` ✅

## v1.8 — 2026-09-20 — Triển khai `sourceNote` (phương án A) — ✅ Hoàn thành

Backend đã chốt **phương án A** (`sourceNote`) — trả lời trong `api-change-request.md` (2026-09-20) và triển khai xong (`con-wms` change-log v1.6). Đính chính bối cảnh: backend từ v1.5 **đã** trả đủ 3 field `inboundNote`/`outboundNote`/`stocktakeNote` (camelCase renderer) — vấn đề thực tế là type FE thiếu khai báo + chưa có `noteType`; phương án A được chọn để gọn + tự mô tả + tránh map `movementType` → field.

| # | Nội dung |
|---|---|
| 1 | `types.ts` — thêm `SourceNoteType` + `SourceNoteRef` (`{ id, number, noteType }`); `StockMovement.inboundNote` → `sourceNote` (giữ `\| null` — luôn có giá trị hiện tại, an toàn tương lai). |
| 2 | `utils.ts` — thêm `SOURCE_NOTE_TYPE_SHORT_CODE` (`inbound → PN`, `outbound → PX`, `stocktake → PK`). |
| 3 | `columns.tsx` — cột "Phiếu" render `sourceNote.number` + badge mã loại phiếu (2 dòng điều chuyển đều mã PX nên không nhầm khi chỉ nhìn số). |
| 4 | Docs: `api-spec.md` (response mẫu + `sourceNote`), `data-model.md` (§1.5/§3/D5), `api-change-request.md` (trạng thái → chốt phương án A). |
| 5 | **Không đổi**: query param `inboundNote` (giữ — backend giữ nguyên param), các field khác của `StockMovement`. |

**Trạng thái:** ✅ Hoàn thành. Validation: `tsc --noEmit` ✅ + `biome check` ✅ (+ `next build` nếu chạy).

## v1.7 — 2026-09-20 — Yêu cầu API backend: `sourceNote` cho mọi loại dòng sổ kho

Phát hiện: cột "Phiếu" ở Sổ kho chỉ hiển thị được mã phiếu **nhập** vì response `GET /api/stock/movements/` chỉ có `inboundNote` (di sản phase 1 — data-model §1.5 ghi rõ "nullable để tương lai outbound/stocktake"). Dòng từ phiếu xuất/kiểm kê trả `inboundNote: null` → hiển thị "-".

| # | Nội dung |
|---|---|
| 1 | Tạo `api-change-request.md` — yêu cầu backend thay `inboundNote` bằng `sourceNote: { id, number, noteType } \| null` (`noteType: "inbound" \| "outbound" \| "stocktake"`) hoặc phương án thay thế additive (`outboundNote` + `stocktakeNote`). |
| 2 | Spec đầy đủ: mapping 6 `movementType` → phiếu nguồn (lưu ý `inbound_transfer_from_warehouse` trỏ về CÙNG phiếu xuất điều chuyển; dòng reversal trỏ về phiếu đã hủy), response mẫu từng loại, phạm vi không đổi. |
| 3 | Frontend chưa code — chờ backend chọn phương án + triển khai API. Sau đó: đổi `types.ts`, cột "Phiếu" (`stock-movements/columns.tsx`, thêm badge loại phiếu PN/PX/PK), cập nhật docs. |

**Trạng thái:** ✅ Đã chốt phương án A + backend triển khai xong (→ v1.8).

## v1.6 — 2026-09-20 — Expanded row: xem tồn theo từng kho ✅ Đã duyệt

Yêu cầu: trang Tồn kho có nút mở rộng (giống các trang phiếu nhập/xuất/kiểm kê) để xem **từng kho** giữ vật tư kèm số lượng. Dữ liệu **đã có sẵn client-side** (`StockBalance[]` theo cặp kho×vật tư) → không đổi API, không đổi query key, không fetch thêm.

**User duyệt 2026-09-20:** (1) OK đổi `warehouses[]` → `warehouseBalances[]`; (2) OK không thêm giá nhập theo kho — giá trị tồn theo kho **luôn tính theo giá nhập gần nhất của vật tư**; (3) không sort mặc định nhưng **cho phép sort bằng bấm header bảng con**.

| # | Nội dung |
|---|---|
| 1 | `types.ts` — thêm `StockBalanceWarehouse` (`warehouse`, `quantity` — **không** lưu giá theo kho, D10); `StockBalanceSummary.warehouses[]` → `warehouseBalances: StockBalanceWarehouse[]` (D9). |
| 2 | `utils.ts` — `aggregateStockBalances()` populate `warehouseBalances` (chỉ kho quantity ≠ 0, giữ thứ tự xuất hiện). |
| 3 | UI `/inventory` — expander column (chevron ▸/▾, `enableSorting: false`) đầu bảng; mới `detail-expanded.tsx` (bảng con: Kho, Số lượng, ĐVT, Giá trị tồn = `quantity × summary.lastPurchasePrice`; `getSortedRowModel` cho phép sort header click); `table-section.tsx` nhận `renderExpandedRow`; `page.tsx` thêm `getRowCanExpand` + `renderExpandedRow`. |

**Validate Context7 (2026-09-20):** `/tanstack/table` (row expansion) — xác nhận pattern chuẩn: `getRowCanExpand` + `row.getIsExpanded()` + render `<tr>` colSpan dưới row (custom expanded UI); `getExpandedRowModel()` chỉ bắt buộc khi cần flatten hàng con (tree/grouping) — flat table không cần. Khớp 100% cơ chế `DataTable.renderExpandedRow` đang dùng ở `notes/*`. Valibot/schema: feature read-only, không đổi. TanStack Query: không đổi hook nào.

**Trạng thái:** ✅ Hoàn thành — đã code + validate (`tsc --noEmit` ✅ + `biome check --write` ✅ + `next build` ✅, 2026-09-20). Lưu ý: `tsc --noEmit` ban đầu báo lỗi ở `.next/types/validator.ts` (artifact build cũ trỏ `inbound-notes` đã đổi tên) → xóa `.next/types` (file sinh tự động) rồi chạy lại là sạch.

**Điều chỉnh 2026-09-20 (sau duyệt, theo user):** bảng con **bỏ cột ĐVT** (không cần thiết — ĐVT đã có ở bảng chính); cột Kho chỉ hiện tên kho (bỏ mã kho), `size 320/160`. Đồng bộ vào `page-design.md` §2.4.

## v1.5 — 2026-09-19 — Phân trang có nút chọn số trang

Component dùng chung **`Pagination`** (`src/components/ui/pagination.tsx`) — hiển thị dãy nút số trang có thu gọn "…":
- trang 1 của 10: `1 2 3 … 9 10`
- trang 6 của 10: `1 2 … 5 6 7 … 9 10`

| # | Nội dung |
|---|---|
| 1 | Tạo `Pagination` — nút prev/next + nút từng trang (trang hiện tại `variant=default`), giữa còn sót nếu > 1 trang thì hiện "…". Quy tắc: luôn hiện 2 trang đầu/cuối; khi ở 3 trang đầu thì mở rộng thành 3; hiện trang hiện tại ± 1. |
| 2 | Footer Sổ kho (`stock-movements/footer.tsx`) chuyển sang dùng `Pagination` (pageCount tính từ `total/pageSize`). |
| 3 | Áp dụng đồng bộ cho các bảng phân trang server-side khác: `materials`, `inbound-notes`, `notes/inbound`, `notes/outbound`, `notes/stocktake`. |
| 4 | `DataTablePagination` (phân trang client-side — warehouses detail) cũng dùng chung `Pagination`. |

**Validation:** `tsc --noEmit` ✅ + `biome check` ✅ + `next build` ✅

## v1.4 — 2026-09-19 — Hậu tố "đ" cho cột tiền + cột "Thành tiền" ở Sổ kho

| # | Nội dung |
|---|---|
| 1 | Thêm helper `formatMoney()` vào `src/utils/format.ts` — format giá trị theo `vi-VN` kèm hậu tố **"đ"**; null/undefined → `"—"` (không kèm "đ"). |
| 2 | **Tồn kho** (`inventory/columns.tsx`): "Giá nhập gần nhất" và "Giá trị tồn" thêm hậu tố "đ". |
| 3 | **Sổ kho** (`stock-movements/columns.tsx`): đổi thứ tự cột → **Đơn giá → Số lượng → Thành tiền**; thêm cột "Thành tiền" = `quantity × unitPrice` (giữ dấu ±, màu xanh/đỏ như cột số lượng, `"—"` khi `unitPrice` null); "Đơn giá" thêm hậu tố "đ". |
| 4 | **Chi tiết dòng phiếu nhập** (`inbound-notes/detail-expanded.tsx` + `notes/inbound/detail-expanded.tsx`): "Đơn giá" và "Thành tiền" của dòng thêm hậu tố "đ". |

**Validation:** `tsc --noEmit` ✅ + `biome check` ✅ + `next build` ✅

## v1.3 — 2026-09-19 — Tồn kho chuyển sang view gộp theo vật tư

Trang `/inventory` không còn phân nhóm theo kho — mỗi vật tư là 1 dòng duy nhất, hiển thị **tổng tồn ở mọi kho** + trường mới **"Các kho có vật liệu này"**. View chi tiết theo từng kho đã có ở trang warehouse detail (`/warehouses/[id]`).

| # | Nội dung |
|---|---|
| 1 | `types.ts` thêm `StockBalanceSummary` — `material`, `unit`, `totalQuantity`, `lastPurchasePrice`, `totalStockValue`, `warehouses[]` (kho có quantity ≠ 0). |
| 2 | `utils.ts` thêm `aggregateStockBalances(balances)` — gộp `StockBalance[]` (backend trả theo cặp warehouse×material) → theo vật tư; cộng decimal bằng số nguyên mở rộng (`sumDecimalStrings`) tránh trôi dấu phẩy động; `lastPurchasePrice` lấy giá cao nhất trong các kho (client không xác định được thứ tự thời gian giữa các dòng). |
| 3 | `columns.tsx` — bỏ cột "Kho", thêm cột "Các kho có vật liệu này" (badge outline, truncate); "Tồn kho"/"Giá trị tồn" hiển thị tổng mọi kho. |
| 4 | `filter-bar.tsx` + `use-stock-params.ts` — **bỏ lọc "Kho"** (không còn phù hợp với view tổng; xem theo kho qua warehouse detail). Giữ lọc danh mục / tồn / search. |
| 5 | `header.tsx`/`footer.tsx` — copy "N dòng tồn kho" → "N mặt hàng". |

**Validation:** `tsc --noEmit` ✅ + `biome check` ✅ + `next build` ✅

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
