export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

export const warehouseKeys = {
  all: ["warehouse"] as const,
  list: () => [...warehouseKeys.all, "list"] as const,
};
