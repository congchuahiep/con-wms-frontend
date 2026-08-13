"use client";

import { useState } from "react";
import type { GetSuppliersParams } from "@/features/supplier";

interface SupplierParamsState {
  params: GetSuppliersParams;
  setSearch: (search: string) => void;
}

export function useSupplierParams(): SupplierParamsState {
  const [params, setParams] = useState<GetSuppliersParams>({ search: "" });

  const setSearch = (search: string) => setParams({ search });

  return { params, setSearch };
}
