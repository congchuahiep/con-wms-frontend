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
};
