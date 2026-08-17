export type Warehouse = {
  id: number;
  code: string;
  name: string;

  address: string;
  latitude: number | null;
  longitude: number | null;

  itemCount: number;
  totalQuantity: number;
  lowStock: number;

  note: string;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * Tham chiếu gọn cho nested reference trong response
 * (vd: StockBalance.warehouse, InboundNote.warehouse)
 */
export type SimpleWarehouse = {
  id: number;
  code: string;
  name: string;
};
