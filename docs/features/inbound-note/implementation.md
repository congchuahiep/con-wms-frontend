# Implementation Checklist — Inbound Note (Phiếu Nhập)

> Thứ tự triển khai theo skill `feature-design` Bước 4.

## Phase 1 — Data layer

- [x] **Simple types ở feature sở hữu** (tiền đề, type-only):
  - [x] `src/features/supplier/types.ts` — thêm `SimpleSupplier = { id, code, name }`
  - [x] `SimpleMaterial` (material), `SimpleWarehouse` (warehouse), `SimpleUser` (auth) — đã làm ở checklist feature `stock`
- [x] **`src/features/inbound-note/types.ts`** — chỉ type definitions:
  - import `SimpleUser` (auth), `SimpleMaterial` (material), `SimpleWarehouse` (warehouse), `SimpleSupplier` (supplier)
  - `InboundNoteType`, `InboundNoteStatus` (union)
  - `InboundNote`, `InboundNoteLine`, `InboundNoteDetail`
  - `InboundNoteInput`, `InboundNoteLineInput`
  - `GetInboundNotesParams` (camelCase: `noteType`, `dateFrom`, `dateTo`)
- [x] **`src/features/inbound-note/utils.ts`** — runtime:
  - `NOTE_STATUS_COLOR_MAP` + `getNoteStatusColorClass()`
  - `getTodayDateString()`
  - `toInboundNoteInput(detail)` — map response detail → input form sửa phiếu
- [x] **`src/features/inbound-note/schemas.ts`** — Valibot:
  - `InboundNoteLineSchema` — `materialId` (nullable + transform + minValue), `quantity` (decimal > 0), `unitPrice` (decimal ≥ 0), `note`
  - `InboundNoteSchema` — `noteType` (picklist), `date` (isoDate), `warehouseId` (nullable + transform + minValue), `supplierId` (nullable), `note`, `lines` (minLength 1) + 2 `v.check` điều kiện supplier trong `v.pipe(v.object(...), ...)`
  - `VoidNoteSchema` — `reason` non-empty, max 1000
- [x] **`src/features/inbound-note/services.ts`**:
  - `useGetInboundNotes(params?)` — `useQuery<Paginated<InboundNote>>` → `ep.inboundNotes.list`
  - `useGetInboundNote(id, options?)` — `useQuery<InboundNoteDetail>` → `ep.inboundNotes.detail`
  - `useAddInboundNote(options?)` — `usePost` + `InboundNoteSchema` → POST `ep.inboundNotes.create`, trả về `InboundNoteDetail` (backend trả kèm lines — OQ-4); invalidate `inboundNoteKeys.all` + `stockKeys.all`
  - `useUpdateInboundNote(id, initialInput, options?)` — **`usePost` + `authApi.put`** (full body replace-all, KHÔNG dirty-track — data-model D3), trả về `InboundNoteDetail`; invalidate `inboundNoteKeys.all`
  - `useDeleteInboundNote()` — `useMutation` → DELETE `ep.inboundNotes.delete`; invalidate `inboundNoteKeys.all`
  - `useFinalizeInboundNote(id)` — `useMutation<InboundNoteDetail>` → POST `ep.inboundNotes.post`; invalidate `inboundNoteKeys.all` **+ `stockKeys.all`** *(tên hook đổi từ `usePostInboundNote` thiết kế ban đầu để tránh nhầm với hook `usePost`)*
  - `useVoidInboundNote(id)` — `usePost` + `VoidNoteSchema` → POST `ep.inboundNotes.void`; invalidate `inboundNoteKeys.all` **+ `stockKeys.all`**
- [x] **`src/configs/endpoints.ts`** — thêm vào `authEndpoints`:
  ```typescript
  inboundNotes: {
    list: "/inbound-notes/",
    create: "/inbound-notes/",
    detail: (id: number) => `/inbound-notes/${id}/`,
    update: (id: number) => `/inbound-notes/${id}/`,
    delete: (id: number) => `/inbound-notes/${id}/`,
    post: (id: number) => `/inbound-notes/${id}/post/`,
    void: (id: number) => `/inbound-notes/${id}/void/`,
  },
  ```
- [x] **`src/configs/querykeys.ts`** — thêm:
  ```typescript
  export const inboundNoteKeys = {
      all: ["inbound-notes"] as const,
      list: () => [...inboundNoteKeys.all, "list"] as const,
      filteredList: (params?: unknown) => [...inboundNoteKeys.list(), params] as const,
      detail: (id: number) => [...inboundNoteKeys.all, "detail", id] as const,
  };
  ```
- [x] **`src/features/inbound-note/index.ts`** — barrel export: `types`, `schemas`, `services`, `utils`
- [x] Chạy typecheck/lint — không lỗi (`tsc --noEmit` + `biome check` trên các file đổi)

## Phase 2 — UI

- [x] UI trang danh sách phiếu + form tạo/sửa + dialog chốt/hủy — xem `page-design.md` (checklist đã check off)
