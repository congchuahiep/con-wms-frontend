# Stock (Tồn kho & Sổ kho) — Index

> Feature folder: `src/features/stock/`
> Backend entity: [`stock`](../../../con-wms/docs/entities/stock/README.md)
> Backend API: [`api.md`](../../../con-wms/docs/entities/stock/api.md)

## Tài liệu

| File | Nội dung |
|---|---|
| [`data-model.md`](data-model.md) | TypeScript types, enums, design decisions |
| [`api-spec.md`](api-spec.md) | API endpoints consumed, request/response spec |
| [`implementation.md`](implementation.md) | Checklist triển khai |
| [`page-design.md`](page-design.md) | Thiết kế UI: tồn kho + sổ kho |
| [`change-log.md`](change-log.md) | Lịch sử thay đổi thiết kế |

## Scope

| Thành phần | Mô tả | Trạng thái |
|---|---|---|
| Data layer | `types.ts` + `utils.ts` + `services.ts` | ✅ Hoàn thành |
| Endpoints | `stock.balances`, `stock.movements` | ✅ Hoàn thành |
| Query keys | `stockKeys` | ✅ Hoàn thành |
| UI | Page tồn kho (`/inventory`) + sổ kho (`/stock-movements`) | ✅ Hoàn thành |

## Trạng thái tổng thể

✅ **Hoàn thành** — data layer + UI (tồn kho + sổ kho)

## Đặc điểm

- **Read-only hoàn toàn** — backend không có endpoint write (stock D9: dòng sổ kho chỉ sinh ra qua chốt/hủy phiếu). Do đó **không có `schemas.ts`**, không có mutation.
- Tồn kho (`/api/stock/`) trả về **mảng phẳng, không phân trang**.
- Sổ kho (`/api/stock/movements/`) **phân trang** (backend page_size=50, sắp xếp `-date, -id`).
- Mọi số decimal trả về dạng **string** (`"85.000"`, `"88000.00"`) — không parse sang `number` để tránh trôi dấu phẩy động.
- `quantity` của dòng sổ kho **có dấu** (+ nhập, − xuất) — UI hiển thị dấu dựa vào giá trị, không dựa vào `movementType`.
