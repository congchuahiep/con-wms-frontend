export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

export const warehouseKeys = {
  all: ["warehouse"] as const,
  list: () => [...warehouseKeys.all, "list"] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
};

export const unitKeys = {
  all: ["units"] as const,
  list: () => [...unitKeys.all, "list"] as const,
  detail: (id: number) => [...unitKeys.all, id] as const,
};

export const unitConversionKeys = {
  all: ["unit-conversions"] as const,
  byUnit: (unitId: number) => [...unitConversionKeys.all, unitId] as const,
};

export const materialKeys = {
  all: ["materials"] as const,
  list: () => [...materialKeys.all, "list"] as const,
  filteredList: (params?: unknown) => [...materialKeys.list(), params] as const,
  detail: (id: number) => [...materialKeys.all, "detail", id] as const,
};

export const supplierKeys = {
  all: ["suppliers"] as const,
  list: () => [...supplierKeys.all, "list"] as const,
  filteredList: (params?: unknown) => [...supplierKeys.list(), params] as const,
  detail: (id: number) => [...supplierKeys.all, "detail", id] as const,
};

export const stockKeys = {
  all: ["stock"] as const,
  balances: (params?: unknown) =>
    [...stockKeys.all, "balances", params] as const,
  movements: (params?: unknown) =>
    [...stockKeys.all, "movements", params] as const,
};

export const inboundNoteKeys = {
  all: ["inbound-notes"] as const,
  list: () => [...inboundNoteKeys.all, "list"] as const,
  filteredList: (params?: unknown) =>
    [...inboundNoteKeys.list(), params] as const,
  detail: (id: number) => [...inboundNoteKeys.all, "detail", id] as const,
};
