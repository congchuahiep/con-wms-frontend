/**
 * Mock data cho WMS — dùng tạm khi chưa có API.
 * Tất cả camelCase, đồng bộ với backend.
 */

export type Warehouse = {
  id: number;
  code: string;
  name: string;
  address: string;
  note: string;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  totalQuantity: number;
  lowStock: number;
};

export type MaterialCategory = {
  id: number;
  name: string;
  children: { id: number; name: string }[];
};

export type Material = {
  id: number;
  sku: string;
  name: string;
  category: string;
  unit: string;
  spec: string;
};

export type InventoryItem = {
  id: number;
  materialId: number;
  warehouseId: number;
  quantity: number;
  location: string;
};

export type InventoryRow = Material & {
  inventoryId: number;
  warehouseId: number;
  warehouseName: string;
  quantity: number;
  location: string;
};

// -----------------------------------------------------------
// Warehouses
// -----------------------------------------------------------

export const warehouses: Warehouse[] = [
  {
    id: 1,
    code: "KHO_CHINH",
    name: "Kho Chính",
    address: "Tầng 1, Tòa nhà VP",
    note: "Kho chính chứa vật liệu xây dựng và hoàn thiện",
    latitude: 10.762622,
    longitude: 106.660172,
    isActive: true,
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2025-06-10T14:30:00Z",
    itemCount: 13,
    totalQuantity: 130,
    lowStock: 0,
  },
  {
    id: 2,
    code: "KHO_PHU",
    name: "Kho Phụ",
    address: "Tầng hầm, Tòa nhà VP",
    note: "Kho chứa thiết bị điện nước và công cụ",
    latitude: 11.948741177146086,
    longitude: 108.4411210656624,
    isActive: true,
    createdAt: "2024-02-20T08:00:00Z",
    updatedAt: "2025-05-15T10:00:00Z",
    itemCount: 9,
    totalQuantity: 90,
    lowStock: 0,
  },
  {
    id: 3,
    code: "KHO_DU_AN_A",
    name: "Kho Dự Án A",
    address: "Công trường A, Q.7",
    note: "Kho công trường dự án A",
    latitude: null,
    longitude: null,
    isActive: true,
    createdAt: "2024-03-10T08:00:00Z",
    updatedAt: "2025-07-01T09:00:00Z",
    itemCount: 5,
    totalQuantity: 50,
    lowStock: 3,
  },
  {
    id: 4,
    code: "KHO_DU_AN_B",
    name: "Kho Dự Án B",
    address: "Công trường B, Q.2",
    note: "Kho công trường dự án B",
    latitude: null,
    longitude: null,
    isActive: true,
    createdAt: "2024-04-05T08:00:00Z",
    updatedAt: "2025-07-20T11:00:00Z",
    itemCount: 3,
    totalQuantity: 30,
    lowStock: 0,
  },
];

// -----------------------------------------------------------
// Material Categories
// -----------------------------------------------------------

export const materialCategories: MaterialCategory[] = [
  {
    id: 1,
    name: "Vật liệu xây dựng",
    children: [
      { id: 11, name: "Xi măng" },
      { id: 12, name: "Cát, đá, sỏi" },
      { id: 13, name: "Gạch, ngói" },
      { id: 14, name: "Sắt, thép" },
    ],
  },
  {
    id: 2,
    name: "Vật liệu hoàn thiện",
    children: [
      { id: 21, name: "Sơn, bột trét" },
      { id: 22, name: "Gạch ốp lát" },
      { id: 23, name: "Thiết bị vệ sinh" },
      { id: 24, name: "Cửa, cửa sổ" },
    ],
  },
  {
    id: 3,
    name: "Vật tư điện nước",
    children: [
      { id: 31, name: "Dây điện, cáp" },
      { id: 32, name: "Ống nước, phụ kiện" },
      { id: 33, name: "Đèn, công tắc" },
    ],
  },
  {
    id: 4,
    name: "Công cụ, dụng cụ",
    children: [
      { id: 41, name: "Máy móc cầm tay" },
      { id: 42, name: "Dụng cụ đo đạc" },
      { id: 43, name: "Bảo hộ lao động" },
    ],
  },
];

// -----------------------------------------------------------
// Materials (catalog — không có số lượng)
// -----------------------------------------------------------

export const materials: Material[] = [
  {
    id: 1,
    sku: "XM-PC40",
    name: "Xi măng PC40",
    category: "Xi măng",
    unit: "Bao",
    spec: "40kg/bao",
  },
  {
    id: 2,
    sku: "XM-PC50",
    name: "Xi măng PC50",
    category: "Xi măng",
    unit: "Bao",
    spec: "50kg/bao",
  },
  {
    id: 3,
    sku: "CAT-VANG",
    name: "Cát vàng xây tô",
    category: "Cát, đá, sỏi",
    unit: "m³",
    spec: "Hạt mịn",
  },
  {
    id: 4,
    sku: "DA-1X2",
    name: "Đá 1x2",
    category: "Cát, đá, sỏi",
    unit: "m³",
    spec: "Xanh đen",
  },
  {
    id: 5,
    sku: "THEP-D10",
    name: "Thép D10",
    category: "Sắt, thép",
    unit: "Cây",
    spec: "11.7m/cây",
  },
  {
    id: 6,
    sku: "THEP-D12",
    name: "Thép D12",
    category: "Sắt, thép",
    unit: "Cây",
    spec: "11.7m/cây",
  },
  {
    id: 7,
    sku: "GACH-ONG",
    name: "Gạch ống 4 lỗ",
    category: "Gạch, ngói",
    unit: "Viên",
    spec: "80x80x180mm",
  },
  {
    id: 8,
    sku: "SON-LOT",
    name: "Sơn lót kháng kiềm",
    category: "Sơn, bột trét",
    unit: "Thùng",
    spec: "18L/thùng",
  },
  {
    id: 9,
    sku: "ONG-NUOC",
    name: "Ống nước PVC D60",
    category: "Ống nước, phụ kiện",
    unit: "Cây",
    spec: "4m/cây",
  },
  {
    id: 10,
    sku: "DAY-DIEN",
    name: "Dây điện 2.5mm²",
    category: "Dây điện, cáp",
    unit: "Cuộn",
    spec: "100m/cuộn",
  },
  {
    id: 11,
    sku: "DEN-LED",
    name: "Đèn LED panel 600x600",
    category: "Đèn, công tắc",
    unit: "Cái",
    spec: "36W",
  },
  {
    id: 12,
    sku: "MAY-KHOAN",
    name: "Máy khoan Bosch",
    category: "Máy móc cầm tay",
    unit: "Cái",
    spec: "GSB 13RE",
  },
  {
    id: 13,
    sku: "THEP-D16",
    name: "Thép D16",
    category: "Sắt, thép",
    unit: "Cây",
    spec: "11.7m/cây",
  },
  {
    id: 14,
    sku: "GACH-LAT",
    name: "Gạch lát nền 60x60",
    category: "Gạch ốp lát",
    unit: "Thùng",
    spec: "4 viên/thùng",
  },
  {
    id: 15,
    sku: "SON-NUOC",
    name: "Sơn nước ngoại thất",
    category: "Sơn, bột trét",
    unit: "Thùng",
    spec: "18L/thùng",
  },
  {
    id: 16,
    sku: "THEP-D8",
    name: "Thép D8",
    category: "Sắt, thép",
    unit: "Cây",
    spec: "11.7m/cây",
  },
  {
    id: 17,
    sku: "THEP-CUON-6",
    name: "Thép cuộn phi 6",
    category: "Sắt, thép",
    unit: "Cuộn",
    spec: "350kg/cuộn",
  },
  {
    id: 18,
    sku: "GACH-DINH",
    name: "Gạch đinh 8x8",
    category: "Gạch, ngói",
    unit: "Viên",
    spec: "80x80x180mm",
  },
  {
    id: 19,
    sku: "BOT-TRET",
    name: "Bột trét tường",
    category: "Sơn, bột trét",
    unit: "Bao",
    spec: "40kg/bao",
  },
  {
    id: 20,
    sku: "XM-XAY-TO",
    name: "Xi măng xây tô",
    category: "Xi măng",
    unit: "Bao",
    spec: "50kg/bao",
  },
  {
    id: 21,
    sku: "ONG-NUOC-90",
    name: "Ống nước PVC D90",
    category: "Ống nước, phụ kiện",
    unit: "Cây",
    spec: "4m/cây",
  },
  {
    id: 22,
    sku: "CUT-NOI-60",
    name: "Cút nối PVC D60",
    category: "Ống nước, phụ kiện",
    unit: "Cái",
    spec: "90°",
  },
  {
    id: 23,
    sku: "DAY-DIEN-15",
    name: "Dây điện 1.5mm²",
    category: "Dây điện, cáp",
    unit: "Cuộn",
    spec: "100m/cuộn",
  },
  {
    id: 24,
    sku: "CONG-TAC",
    name: "Công tắc đơn Panasonic",
    category: "Đèn, công tắc",
    unit: "Cái",
    spec: "10A",
  },
  {
    id: 25,
    sku: "THUOC-CUON",
    name: "Thước cuộn 5m",
    category: "Dụng cụ đo đạc",
    unit: "Cái",
    spec: "Stanley 5m",
  },
  {
    id: 26,
    sku: "THEP-D20",
    name: "Thép D20",
    category: "Sắt, thép",
    unit: "Cây",
    spec: "11.7m/cây",
  },
  {
    id: 27,
    sku: "GACH-OP",
    name: "Gạch ốp tường 30x60",
    category: "Gạch ốp lát",
    unit: "Thùng",
    spec: "8 viên/thùng",
  },
  {
    id: 28,
    sku: "VUA-KHO",
    name: "Vữa khô",
    category: "Xi măng",
    unit: "Bao",
    spec: "25kg/bao",
  },
  {
    id: 29,
    sku: "SON-DAU",
    name: "Sơn dầu chống rỉ",
    category: "Sơn, bột trét",
    unit: "Thùng",
    spec: "18L/thùng",
  },
  {
    id: 30,
    sku: "BANG-KEO",
    name: "Băng keo chống thấm",
    category: "Cửa, cửa sổ",
    unit: "Cuộn",
    spec: "10cm x 10m",
  },
];

// -----------------------------------------------------------
// Inventory (tồn kho theo kho)
// -----------------------------------------------------------

export const inventoryItems: InventoryItem[] = [
  // Kho Chính
  { id: 1, materialId: 1, warehouseId: 1, quantity: 250, location: "A-01-03" },
  { id: 2, materialId: 2, warehouseId: 1, quantity: 120, location: "A-01-05" },
  { id: 3, materialId: 3, warehouseId: 1, quantity: 35, location: "B-02-01" },
  { id: 4, materialId: 4, warehouseId: 1, quantity: 50, location: "B-02-02" },
  { id: 5, materialId: 5, warehouseId: 1, quantity: 200, location: "C-03-01" },
  { id: 6, materialId: 6, warehouseId: 1, quantity: 150, location: "C-03-02" },
  { id: 7, materialId: 7, warehouseId: 1, quantity: 5000, location: "A-02-01" },
  { id: 8, materialId: 8, warehouseId: 1, quantity: 30, location: "D-04-01" },
  {
    id: 16,
    materialId: 16,
    warehouseId: 1,
    quantity: 300,
    location: "C-03-03",
  },
  { id: 17, materialId: 17, warehouseId: 1, quantity: 25, location: "C-03-04" },
  {
    id: 18,
    materialId: 18,
    warehouseId: 1,
    quantity: 3500,
    location: "A-02-03",
  },
  { id: 19, materialId: 19, warehouseId: 1, quantity: 80, location: "D-04-02" },
  {
    id: 20,
    materialId: 20,
    warehouseId: 1,
    quantity: 180,
    location: "A-01-04",
  },

  // Kho Phụ
  { id: 9, materialId: 9, warehouseId: 2, quantity: 80, location: "E-01-01" },
  { id: 10, materialId: 10, warehouseId: 2, quantity: 45, location: "F-02-01" },
  { id: 11, materialId: 11, warehouseId: 2, quantity: 60, location: "F-02-03" },
  { id: 12, materialId: 12, warehouseId: 2, quantity: 8, location: "G-03-01" },
  { id: 21, materialId: 21, warehouseId: 2, quantity: 55, location: "E-01-02" },
  {
    id: 22,
    materialId: 22,
    warehouseId: 2,
    quantity: 120,
    location: "E-01-03",
  },
  { id: 23, materialId: 23, warehouseId: 2, quantity: 70, location: "F-02-02" },
  { id: 24, materialId: 24, warehouseId: 2, quantity: 90, location: "F-02-04" },
  { id: 25, materialId: 25, warehouseId: 2, quantity: 15, location: "G-03-02" },

  // Kho Dự Án A
  {
    id: 13,
    materialId: 13,
    warehouseId: 3,
    quantity: 100,
    location: "H-01-01",
  },
  { id: 14, materialId: 14, warehouseId: 3, quantity: 75, location: "H-01-02" },
  { id: 26, materialId: 26, warehouseId: 3, quantity: 80, location: "H-01-03" },
  {
    id: 27,
    materialId: 27,
    warehouseId: 3,
    quantity: 110,
    location: "H-01-04",
  },
  { id: 28, materialId: 28, warehouseId: 3, quantity: 45, location: "H-01-05" },

  // Kho Dự Án B
  { id: 15, materialId: 15, warehouseId: 4, quantity: 20, location: "I-01-01" },
  { id: 29, materialId: 29, warehouseId: 4, quantity: 18, location: "I-01-02" },
  { id: 30, materialId: 30, warehouseId: 4, quantity: 35, location: "I-01-03" },
];

// -----------------------------------------------------------
// Derived data
// -----------------------------------------------------------

export const inventory: InventoryRow[] = inventoryItems
  .map((item) => {
    const material = materials.find((m) => m.id === item.materialId);
    const warehouse = warehouses.find((w) => w.id === item.warehouseId);
    if (!material || !warehouse) return null;
    return {
      ...material,
      inventoryId: item.id,
      warehouseId: item.warehouseId,
      warehouseName: warehouse.name,
      quantity: item.quantity,
      location: item.location,
    };
  })
  .filter((item): item is InventoryRow => item !== null);

export function getWarehouseInventory(warehouseId: number): InventoryRow[] {
  return inventory.filter((item) => item.warehouseId === warehouseId);
}

export function getWarehouseById(id: number): Warehouse | undefined {
  return warehouses.find((w) => w.id === id);
}
