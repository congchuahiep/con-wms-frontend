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
