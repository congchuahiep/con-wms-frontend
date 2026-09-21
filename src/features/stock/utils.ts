import type { InboundNoteType } from "../inbound-note";
import type {
  MovementType,
  SourceNoteType,
  StockBalance,
  StockBalanceSummary,
  StockBalanceWarehouse,
} from "./types";

/**
 * Cộng chuỗi decimal theo scale cố định bằng số nguyên mở rộng — tránh trôi
 * dấu phẩy động của Number (`0.001 + 0.001 !== 0.002`). Hỗ trợ 1 dấu trừ đầu;
 * phần thập phân ngắn được đệm 0, dài bị cắt theo scale. Nếu `values` rỗng
 * trả về "0" + scale số 0.
 */
function sumDecimalStrings(values: string[], scale: number): string {
  const factor = 10 ** scale;
  const total = values.reduce((acc, value) => {
    const negative = value.startsWith("-");
    const unsigned = negative ? value.slice(1) : value;
    const [intPart, rawFracPart = ""] = unsigned.split(".");
    const fracPart = rawFracPart.padEnd(scale, "0").slice(0, scale);
    const scaled =
      ((Number.parseInt(intPart, 10) || 0) * factor +
        (Number.parseInt(fracPart, 10) || 0)) *
      (negative ? -1 : 1);
    return acc + scaled;
  }, 0);

  const absolute = Math.abs(total);
  const intPart = Math.floor(absolute / factor).toString();
  const fracPart = String(absolute % factor).padStart(scale, "0");
  return `${total < 0 ? "-" : ""}${intPart}.${fracPart}`;
}

/**
 * Gộp mảng tồn kho theo (warehouse, material) → danh sách theo vật tư: mỗi
 * vật tư đúng 1 dòng, `totalQuantity`/`totalStockValue` là tổng ở mọi kho,
 * `warehouseBalances` = tồn theo từng kho đang giữ hàng (quantity ≠ 0). Giữ
 * thứ tự xuất hiện đầu tiên của backend. Dùng cho trang Tồn kho (view chi
 * tiết theo kho nằm ở expanded row + trang warehouse detail).
 */
export function aggregateStockBalances(
  balances: StockBalance[],
): StockBalanceSummary[] {
  const groups = new Map<
    number,
    {
      material: StockBalance["material"];
      unit: StockBalance["unit"];
      quantities: string[];
      values: string[];
      maxPrice: number | null;
      warehouseBalances: Map<number, StockBalanceWarehouse>;
    }
  >();

  for (const balance of balances) {
    let group = groups.get(balance.material.id);
    if (!group) {
      group = {
        material: balance.material,
        unit: balance.unit,
        quantities: [],
        values: [],
        maxPrice: null,
        warehouseBalances: new Map(),
      };
      groups.set(balance.material.id, group);
    }

    group.quantities.push(balance.quantity);

    if (balance.stockValue !== null) group.values.push(balance.stockValue);

    const price =
      balance.lastPurchasePrice === null
        ? null
        : Number(balance.lastPurchasePrice);
    if (price !== null && (group.maxPrice === null || price > group.maxPrice)) {
      group.maxPrice = price;
    }

    if (Number(balance.quantity) !== 0) {
      group.warehouseBalances.set(balance.warehouse.id, {
        warehouse: balance.warehouse,
        quantity: balance.quantity,
      });
    }
  }

  return [...groups.values()].map((group) => ({
    material: group.material,
    unit: group.unit,
    totalQuantity: sumDecimalStrings(group.quantities, 3),
    lastPurchasePrice:
      group.maxPrice === null ? null : group.maxPrice.toFixed(2),
    totalStockValue:
      group.values.length > 0 ? sumDecimalStrings(group.values, 2) : null,
    warehouseBalances: [...group.warehouseBalances.values()],
  }));
}

/**
 * Màu badge cho từng loại dòng sổ kho (dùng ở tồn kho + sổ kho).
 */
export const MOVEMENT_TYPE_COLOR_MAP: Record<MovementType, string> = {
  inbound_purchase_from_supplier:
    "bg-green-100 text-green-700 border-green-300",
  inbound_return_from_site: "bg-teal-100 text-teal-700 border-teal-300",
  outbound_issue_for_use: "bg-red-100 text-red-700 border-red-300",
  outbound_transfer_to_warehouse:
    "bg-orange-100 text-orange-700 border-orange-300",
  inbound_transfer_from_warehouse: "bg-blue-100 text-blue-700 border-blue-300",
  stocktake_adjustment: "bg-purple-100 text-purple-700 border-purple-300",
};

/**
 * Label tiếng Việt cho filter/select (backend trả sẵn label ở response).
 */
export const MOVEMENT_TYPE_LABEL_MAP: Record<MovementType, string> = {
  inbound_purchase_from_supplier: "Nhập kho: mua hàng từ nhà cung cấp",
  inbound_return_from_site: "Nhập kho: công trường trả lại hàng",
  outbound_issue_for_use: "Xuất kho: cấp phát để sử dụng",
  outbound_transfer_to_warehouse: "Xuất kho: điều chuyển sang kho khác",
  inbound_transfer_from_warehouse: "Nhập kho: điều chuyển từ kho khác",
  stocktake_adjustment: "Điều chỉnh tồn: chênh lệch kiểm kê",
};

export const MOVEMENT_TYPES = Object.keys(
  MOVEMENT_TYPE_LABEL_MAP,
) as MovementType[];

export function getMovementTypeColorClass(type: MovementType): string {
  return (
    MOVEMENT_TYPE_COLOR_MAP[type] ??
    "bg-muted text-muted-foreground border-border"
  );
}

export const INBOUND_NOTE_TYPE_COLOR_MAP: Record<InboundNoteType, string> = {
  purchase: "bg-green-200 text-green-800 border-green-600",
  return_from_site: "bg-purple-200 text-purple-800 border-purple-600",
};

export const INBOUND_NOTE_TYPE_LABEL_MAP: Record<InboundNoteType, string> = {
  purchase: "Nhập kho: mua hàng",
  return_from_site: "Nhập kho: trả lại hàng",
};

export const INBOUND_NOTE_TYPES: InboundNoteType[] = Object.keys(
  INBOUND_NOTE_TYPE_LABEL_MAP,
) as InboundNoteType[];

export function getInboundNoteTypeColorClass(type: InboundNoteType): string {
  return (
    INBOUND_NOTE_TYPE_COLOR_MAP[type] ??
    "bg-muted text-muted-foreground border-border"
  );
}

/**
 * Mã ngắn hiển thị loại phiếu nguồn (badge cột "Phiếu" ở Sổ kho) — PN/PX/PK.
 * Dòng nhập do điều chuyển cũng hiện PX (nguồn là phiếu xuất điều chuyển).
 */
export const SOURCE_NOTE_TYPE_SHORT_CODE: Record<SourceNoteType, string> = {
  inbound: "PN",
  outbound: "PX",
  stocktake: "PK",
};

/**
 * Format số lượng có dấu: "100.000" → "+100.000", "-5.500" giữ nguyên.
 * Dấu dựa vào dữ liệu (không suy từ movementType - stocktake_adjustment/reversal có thể âm).
 */
export function formatSignedQuantity(quantity: string): string {
  const value = Number(quantity);
  if (value > 0) return `+${quantity}`;
  return quantity;
}
