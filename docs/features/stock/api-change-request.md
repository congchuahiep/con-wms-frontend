# Yêu cầu thay đổi API — Sổ kho: trả phiếu nguồn cho mọi loại dòng

> Gửi tới: backend `con-wms` — entity `stock`
> Người yêu cầu: frontend `con-wms-frontend`
> Ngày: 2026-09-20 | Trạng thái: 🟢 **Đã chốt phương án A (`sourceNote`)** — backend đã triển khai (2026-09-20), frontend làm song song (xem `change-log.md` v1.8)

## 1. Bối cảnh

Trang **Sổ kho** (`/stock-movements`) có cột **"Phiếu"** hiển thị số phiếu đã sinh ra dòng sổ kho. Hiện tại cột này **chỉ hiển thị được số phiếu nhập (PN)** — các dòng sinh từ phiếu xuất (PX) và phiếu kiểm kê (PK) hiển thị dấu `-`.

**Nguyên nhân:** response `GET /api/stock/movements/` chỉ có **1 trường phiếu nguồn duy nhất: `inboundNote`** (thiết kế từ phase 1 khi mới có phiếu nhập). Các dòng sổ kho từ phiếu xuất/kiểm kê trả về `inboundNote: null` nên frontend không có dữ liệu để hiển thị.

## 2. Yêu cầu

Mở rộng response `GET /api/stock/movements/`: mỗi dòng sổ kho trả về **phiếu nguồn** tương ứng với loại nghiệp vụ — không chỉ riêng phiếu nhập.

## 3. Phương án đề xuất (khuyến nghị)

**Thay `inboundNote` bằng 1 trường tổng quát `sourceNote`** — tự mô tả loại phiếu, frontend không phải map `movementType` → field:

```jsonc
// Trong item của GET /api/stock/movements/
"sourceNote": {
  "id": 3,
  "number": "PN-20260813-001",
  "noteType": "inbound"        // "inbound" | "outbound" | "stocktake"
}
```

`noteType` là phân loại **loại phiếu** (đồng bộ với 3 nhóm page `/notes/<type>` ở frontend):

| `noteType` | Loại phiếu | Số phiếu ví dụ |
|---|---|---|
| `inbound` | Phiếu nhập (`inbound-note`) | `PN-20260813-001` |
| `outbound` | Phiếu xuất (`outbound-note`) | `PX-20260915-002` |
| `stocktake` | Phiếu kiểm kê (`stocktake`) | `PK-20260918-001` |

**Phương án thay thế (nếu muốn additive, không breaking):** giữ `inboundNote` và thêm `outboundNote` + `stocktakeNote` (cùng shape `{id, number} | null`, không kèm `noteType` — frontend suy loại từ `movementType`). Frontend thích ứng được cả 2 phương án, nhưng khuyến nghị phương án `sourceNote` vì gọn và tự mô tả.

## 4. Spec chi tiết

### 4.1 Type mới

```typescript
type SourceNoteRef = {
  id: number;
  number: string;                                        // "PN-...", "PX-...", "PK-..."
  noteType: "inbound" | "outbound" | "stocktake";
};

// Thay field cũ: inboundNote → sourceNote
type StockMovement = {
  // ...các field hiện tại giữ nguyên...
  inboundNote: SourceNoteRef | null;   // ❌ XÓA
  sourceNote: SourceNoteRef | null;    // ✅ MỚI (nullable vì thiết kế mở rộng tương lai)
  // ...reversalOf, reason,... giữ nguyên
};
```

> Hiện tại mọi dòng sổ kho đều sinh từ một phiếu → `sourceNote` **luôn có giá trị**. Giữ kiểu `null` để an toàn cho tương lai (nếu sau này có dòng điều chỉnh khác không thuộc phiếu nào).

### 4.2 Quy tắc mapping `movementType` → `sourceNote`

| `movementType` | `sourceNote.noteType` | `sourceNote` = | Ghi chú |
|---|---|---|---|
| `inbound_purchase_from_supplier` | `inbound` | Phiếu nhập (loại `purchase`) | Giống `inboundNote` cũ |
| `inbound_return_from_site` | `inbound` | Phiếu nhập (loại `return_from_site`) | Giống `inboundNote` cũ |
| `outbound_issue_for_use` | `outbound` | Phiếu xuất (loại `issue_for_use`) | Mới |
| `outbound_transfer_to_warehouse` | `outbound` | Phiếu xuất điều chuyển (loại `transfer`) — dòng xuất ở **kho nguồn** | Mới |
| `inbound_transfer_from_warehouse` | `outbound` | **CÙNG phiếu xuất điều chuyển đó** — dòng nhập ở **kho đích** | Mới — cẩn thận: nguồn vẫn là phiếu **xuất** |
| `stocktake_adjustment` | `stocktake` | Phiếu kiểm kê | Mới |
| dòng reversal (`reversalOf != null`) | như dòng gốc | **Cùng phiếu nguồn của dòng gốc** — tức phiếu đã bị hủy | Trường quan trọng dễ sót |

### 4.3 Response mẫu — đủ 6 loại

```jsonc
// 1. Nhập kho: mua hàng từ NCC
{
  "id": 12,
  "movementType": "inbound_purchase_from_supplier",
  "movementTypeLabel": "Nhập kho: mua hàng từ nhà cung cấp",
  "material": { "id": 1, "code": "XM_PCB40", "name": "Xi măng PCB40" },
  "warehouse": { "id": 1, "code": "KHO_CHINH", "name": "Kho chính — Bãi sau" },
  "quantity": "100.000",
  "unitPrice": "88000.00",
  "sourceNote": { "id": 3, "number": "PN-20260813-001", "noteType": "inbound" },
  "reversalOf": null,
  "reason": "",
  "createdBy": { "id": 2, "email": "thukho@test.com" },
  "createdAt": "2026-08-13T08:30:00+07:00"
}

// 2. Nhập kho: công trường trả lại
{ "movementType": "inbound_return_from_site", "quantity": "5.000",
  "sourceNote": { "id": 9, "number": "PN-20260902-004", "noteType": "inbound" }, ... }

// 3. Xuất kho: cấp phát sử dụng
{ "movementType": "outbound_issue_for_use", "quantity": "-20.000",
  "sourceNote": { "id": 15, "number": "PX-20260915-002", "noteType": "outbound" }, ... }

// 4. Xuất kho: điều chuyển sang kho khác (dòng xuất ở kho nguồn)
{ "movementType": "outbound_transfer_to_warehouse", "quantity": "-10.000",
  "sourceNote": { "id": 17, "number": "PX-20260916-001", "noteType": "outbound" }, ... }

// 5. NHẬP kho: điều chuyển từ kho khác (dòng nhập ở kho đích — cùng 1 phiếu xuất!)
{ "movementType": "inbound_transfer_from_warehouse", "quantity": "10.000",
  "sourceNote": { "id": 17, "number": "PX-20260916-001", "noteType": "outbound" }, ... }

// 6. Điều chỉnh tồn: chênh lệch kiểm kê
{ "movementType": "stocktake_adjustment", "quantity": "-1.500",
  "sourceNote": { "id": 21, "number": "PK-20260918-001", "noteType": "stocktake" }, ... }

// 7. Dòng hủy phiếu (reversal) — sourceNote trỏ về phiếu đã bị hủy, giống dòng gốc
{ "movementType": "inbound_purchase_from_supplier", "quantity": "-100.000",
  "reversalOf": 12,
  "sourceNote": { "id": 3, "number": "PN-20260813-001", "noteType": "inbound" },
  "reason": "Hủy phiếu PN-20260813-001: nhập sai số lượng", ... }
```

## 5. Phạm vi KHÔNG đổi

| Mục | Lý do |
|---|---|
| `GET /api/stock/` (tồn kho hiện tại) | Không cần phiếu nguồn — chỉ có quantity/giá theo (warehouse, material) |
| Query params của `GET /api/stock/movements/` (gồm `inboundNote`) | Frontend hiện **chưa dùng** param này; đổi sẽ gây breaking không cần thiết. Nếu sau này cần lọc sổ kho theo 1 phiếu bất kỳ, sẽ tách yêu cầu riêng |
| Các field khác của `StockMovement` (`movementType`, `reversalOf`, `reason`, ...) | Giữ nguyên |

## 6. Phía frontend sẽ làm gì sau khi API đổi

1. `src/features/stock/types.ts` — thay `inboundNote` bằng `sourceNote` (phương án A) hoặc thêm `outboundNote`/`stocktakeNote` (phương án B).
2. `src/app/(app)/stock-movements/columns.tsx` — cột "Phiếu" render `sourceNote.number`; hiển thị thêm badge loại phiếu (PN/PX/PK) dựa trên `noteType` cho dễ phân biệt (2 dòng điều chuyển đều hiện mã PX nên nếu chỉ nhìn số có thể nhầm).
3. Cập nhật `docs/features/stock/` (data-model, api-spec, change-log).

**Frontend cần backend trả lời:** chọn phương án `sourceNote` (A) hay 3 field riêng (B)? Thống nhất xong, backend + frontend làm song song.

> ✅ **Trả lời của backend (2026-09-20): chọn phương án A — `sourceNote`.** Đính chính bối cảnh: từ v1.5 backend **đã** trả đủ 3 field (`inboundNote`/`outboundNote`/`stocktakeNote`) qua camelCase renderer — vấn đề thực tế là type FE thiếu khai báo + chưa có `noteType`. Phương án A vẫn được chọn vì gọn, tự mô tả và tránh map `movementType` → field (bẫy `inbound_transfer_from_warehouse` → phiếu xuất).