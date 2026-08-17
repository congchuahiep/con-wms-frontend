# Change Log — Inbound Note (Phiếu Nhập)

## v1.2 — 2026-08-14 — Đổi tên enum `noteType` theo backend v2.1

Nguồn: backend [`../../../con-wms/docs/entities/stock/frontend-migration.md`](../../../con-wms/docs/entities/stock/frontend-migration.md)

| # | Nội dung |
|---|---|
| 1 | `InboundNoteType`: `"return"` → `"return_from_site"` — đồng bộ `types.ts`, `schemas.ts` (picklist + cross-field check), filter bar, `NoteForm`. |
| 2 | Label "Nhập hoàn trả" → "Nhập hàng công trường trả lại" ở filter + nút chọn loại phiếu; message lỗi schema cập nhật theo. |
| 3 | Hiển thị dùng `noteTypeLabel` từ API — không hardcode label trong UI. |

**Validation:** `tsc --noEmit` ✅ + `biome check` trên các file đổi ✅

## v1.1 — 2026-08-13 — Đã triển khai UI

| # | Nội dung |
|---|---|
| 1 | **Danh sách `/inbound-notes`**: phân trang server-side (pageSize 20), filters (trạng thái, loại, kho, NCC, ngày từ/đến, search số phiếu), badge trạng thái, dropdown actions theo status. |
| 2 | **Create/Edit dialog**: `NoteForm` dùng chung — loại phiếu (2 nút, return tự xóa supplier), ngày, kho, NCC (ẩn khi return), ghi chú, lines editor (Formisch `insert`/`remove` + key ổn định từ `useFieldArray`), tổng SL/tiền live. |
| 3 | **Barcode flow**: ô "Quét mã/SKU" → Enter → tìm vật tư theo code chính xác (`fetchQuery` materials search) → thêm dòng mới + focus số lượng, hoặc toast nếu trùng/không tìm thấy. |
| 4 | **Chốt**: `ConfirmDialog` (mới — generic, trích từ DeleteConfirmDialog) + cảnh báo bất biến. **Hủy**: dialog form `VoidNoteSchema` bắt buộc lý do. **Xóa**: `DeleteConfirmDialog` (chỉ draft). **Chi tiết**: dialog read-only (fetch `useGetInboundNote`, bảng lines + thông tin hủy nếu voided). |
| 5 | Edit dialog lấy detail qua `noteId` (list không kèm lines) — form mount khi detail sẵn (pre-fill pattern). |
| 6 | `WarehouseSelectField`, `SupplierSelectField` (feature warehouse/supplier), `src/utils/format.ts` (formatDecimal/formatDate/formatDateTime). |
| 7 | Sidebar thêm "Phiếu nhập" (nhóm Nghiệp vụ). |

**Validation:** `tsc --noEmit` ✅ + `biome check` ✅ + `next build` ✅

## v1.0 — 2026-08-13 — Đã triển khai data layer

Code theo thiết kế v0.2 với các điều chỉnh ghi nhận khi code:

- `src/features/inbound-note/types.ts` — unions, `InboundNote`, `InboundNoteLine`, `InboundNoteDetail`, inputs, params camelCase
- `src/features/inbound-note/utils.ts` — `NOTE_STATUS_COLOR_MAP`, `getTodayDateString`, `toInboundNoteInput` (thêm so với thiết kế: map detail → input form sửa)
- `src/features/inbound-note/schemas.ts` — `InboundNoteLineSchema`, `InboundNoteSchema`, `VoidNoteSchema`
- `src/features/inbound-note/services.ts` — 7 hooks: `useGetInboundNotes`, `useGetInboundNote`, `useAddInboundNote`, `useUpdateInboundNote`, `useDeleteInboundNote`, `useFinalizeInboundNote`, `useVoidInboundNote`
- `src/configs/endpoints.ts` — `inboundNotes` (7 endpoint); `src/configs/querykeys.ts` — `inboundNoteKeys`
- `SimpleSupplier` thêm vào `supplier/types.ts`

**Lệch thiết kế nhỏ (đã cập nhật data-model.md):**

| # | Thay đổi | Lý do |
|---|---|---|
| 1 | `usePostInboundNote` → **`useFinalizeInboundNote`** | Tránh nhầm tên với hook `usePost` trong cùng file |
| 2 | `v.object(entries, [v.check(...)])` → **`v.pipe(v.object(...), v.check(...))`** | Valibot v1.4.2 bỏ qua pipeline array ở arg 2 của `v.object` (đã test runtime) — bọc `v.pipe` mới chạy |
| 3 | `noteType` dùng **`v.picklist`** thay `v.union` 2 literal | `v.union` khiến Formisch khởi tạo field store kiểu union — picklist là value field an toàn cho select |
| 4 | `warehouseId`/`materialId` **nullable + transform → 0 + minValue(1)** | Khớp pattern `categoryId`/`toUnitId` của `material/schemas.ts` |

**Validation:** `tsc --noEmit` ✅ + `biome check` trên các file đổi ✅ + test runtime schema bằng bun (5 case pass: purchase/return hợp lệ, thiếu supplier, thừa supplier, quantity=0, lines rỗng)

## v0.2 — 2026-08-13 — Theo phản hồi duyệt thiết kế

| # | Nội dung |
|---|---|
| 1 | Đổi `SupplierRef`/`MaterialRef`/`WarehouseRef`/`UserRef` → **`SimpleSupplier`/`SimpleMaterial`/`SimpleWarehouse`/`SimpleUser`** theo quy chuẩn dự án. Simple types đặt ở **feature sở hữu** (thêm `SimpleSupplier` vào `supplier/types.ts`), import type-only — bỏ thiết kế cũ "import từ stock". |
| 2 | Query params chuyển sang **camelCase** (`noteType`, `dateFrom`, `dateTo`…) — backend xác nhận đã normalize camelCase. |
| 3 | **OQ-1 đã chốt:** phân trang trả `{items, meta}` — dùng `Paginated<T>`; doc backend ghi `{count, results}` là lộn. |
| 4 | **OQ-4 đã chốt:** POST tạo phiếu trả về kèm `lines` → response type `InboundNoteDetail` (thêm D10). |

## v0.1 — 2026-08-13 — Thiết kế ban đầu

**Nguồn đầu vào:**

- Backend `docs/entities/inbound-note/model.md` (model `InboundNote` + `InboundNoteLine`, D1–D12)
- Backend `docs/entities/inbound-note/api.md` (7 endpoint, validation rules)
- Backend `docs/entities/inbound-note/auth.md` (IsAdminOrStorekeeper cho write)
- Frontend convention: `docs/features/supplier/` + `src/features/material*/`

**Quyết định chính:**

| # | Nội dung |
|---|---|
| 1 | `quantity`/`unitPrice` input là **string** decimal, validate `v.decimal()` + `v.check()` — khớp backend nhận string |
| 2 | Supplier điều kiện bằng **2 `v.check` trên object** (purchase bắt buộc / return cấm), không `v.union` 2 schema |
| 3 | **PUT replace-all không dùng `usePartialUpdate`** — dirty-tracking sẽ bỏ sót `lines` khi user không sửa → backend xóa sạch dòng |
| 4 | Chốt = `useMutation`; hủy = `usePost` + `VoidNoteSchema` (form lý do) |
| 5 | Mọi mutation invalidate **cả `inboundNoteKeys` và `stockKeys`** (chốt/hủy đổi tồn kho + sổ kho) |
| 6 | Ref types dùng lại từ `src/features/stock/types.ts` (type-only import, không cycle) |
| 7 | Flag OQ-1/OQ-2/OQ-4 cần xác nhận với backend |

**Validate Context7 (2026-08-13):**

- **Valibot** (`/websites/valibot_dev`) — xác nhận:
  - `v.decimal()` validate chuỗi thập phân ✓
  - `v.isoDate()` validate ISO date ✓
  - `v.minLength(1)` cho array (`lines`) ✓
  - `v.check()` pipeline cho rule điều kiện cross-field ✓
  - `v.union([v.literal(...)])` cho enum ✓
- **TanStack Query v5** (`/tanstack/query`) — xác nhận object signature `useQuery({queryKey, queryFn})`, `useMutation({mutationFn})`, `invalidateQueries` prefix match (`exact: false` mặc định) — khớp pattern repo.

**Open questions:** OQ-1/OQ-2/OQ-4 — đã giải quyết ở v0.2.
