# Implementation Checklist — Stock (Tồn kho & Sổ kho)

> Thứ tự triển khai theo skill `feature-design` Bước 4.
> Feature read-only → **không có bước schemas.ts**.

## Phase 1 — Data layer

- [x] **Simple types ở feature sở hữu** (tiền đề, type-only — không ảnh hưởng runtime):
  - [x] `src/features/material/types.ts` — thêm `SimpleMaterial = { id, code, name }`
  - [x] `src/features/warehouse/types.ts` — thêm `SimpleWarehouse = { id, code, name }`
  - [x] `src/features/auth/types.ts` — thêm `SimpleUser = { id, email }`
  - [x] `SimpleUnit` — đã có sẵn ở `src/features/unit/types.ts`, reuse
- [x] **`src/features/stock/types.ts`** — chỉ type definitions:
  - import `SimpleUnit` (unit), `SimpleMaterial` (material), `SimpleWarehouse` (warehouse), `SimpleUser` (auth)
  - `MovementType` (union 6 giá trị)
  - `StockBalance`
  - `StockMovement`
  - `GetStockParams` (camelCase: `hasStock`), `GetStockMovementsParams` (camelCase: `movementType`, `dateFrom`, `dateTo`, `inboundNote`, `originalsOnly`)
- [x] **`src/features/stock/utils.ts`** — runtime:
  - `MOVEMENT_TYPE_COLOR_MAP` (6 loại dòng)
  - `getMovementTypeColorClass(type)`
  - `formatSignedQuantity(quantity)`
- [x] **`src/features/stock/services.ts`**:
  - `useGetStockBalances(params?)` — `useQuery<StockBalance[]>` → `ep.stock.balances`
  - `useGetStockMovements(params?)` — `useQuery<Paginated<StockMovement>>` → `ep.stock.movements`
  - Không có mutation (read-only)
- [x] **`src/configs/endpoints.ts`** — thêm vào `authEndpoints`:
  ```typescript
  stock: {
    balances: "/stock/",
    movements: "/stock/movements/",
  },
  ```
- [x] **`src/configs/querykeys.ts`** — thêm:
  ```typescript
  export const stockKeys = {
      all: ["stock"] as const,
      balances: (params?: unknown) => [...stockKeys.all, "balances", params] as const,
      movements: (params?: unknown) => [...stockKeys.all, "movements", params] as const,
  };
  ```
- [x] **`src/features/stock/index.ts`** — barrel export: `types`, `services`, `utils`
- [x] Chạy typecheck/lint — không lỗi (`tsc --noEmit` + `biome check` trên các file đổi)

## Phase 2 — UI

- [x] UI trang tồn kho + sổ kho — xem `page-design.md` (checklist đã check off)
