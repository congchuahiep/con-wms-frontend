export type SimpleSiteRef = {
  id: number;
  code: string;
  name: string;
};

export type Warehouse = {
  id: number;
  code: string;
  name: string;

  /** Công trường sở hữu — khác null nghĩa là kho công trường (tự động tạo). */
  site: SimpleSiteRef | null;

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
