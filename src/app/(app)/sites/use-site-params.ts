"use client";
import { useState } from "react";
import type { GetSitesParams } from "@/features/site";
export function useSiteParams() {
  const [params, setParams] = useState<GetSitesParams>({ search: "" });
  return { params, setSearch: (v: string) => setParams({ search: v }) };
}
