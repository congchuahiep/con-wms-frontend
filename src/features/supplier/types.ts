export type Supplier = {
  id: number;
  code: string;
  name: string;
  taxCode: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Input cho POST/PATCH — không gửi id, isActive, createdAt, updatedAt. */
export type SupplierInput = {
  code: string;
  name: string;
  taxCode: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  note: string;
};

/**
 * Tham chiếu gọn cho nested reference trong response
 * (vd: InboundNote.supplier)
 */
export type SimpleSupplier = {
  id: number;
  code: string;
  name: string;
};
