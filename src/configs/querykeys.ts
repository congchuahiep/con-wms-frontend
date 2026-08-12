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
