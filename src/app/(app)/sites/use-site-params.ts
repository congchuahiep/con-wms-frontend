"use client";

import { useCallback, useState } from "react";
import type { GetSitesParams, SiteStatus } from "@/features/site";

type StatusFilter = SiteStatus | "all";

interface SiteParamsState {
  params: GetSitesParams;
  /** Trạng thái lọc hiện tại — mặc định active (backend mặc định chỉ trả site đang hoạt động). */
  status: StatusFilter;
  setSearch: (search: string) => void;
  setStatus: (status: StatusFilter) => void;
}

export function useSiteParams(): SiteParamsState {
  const [search, setSearchState] = useState("");
  const [status, setStatusState] = useState<StatusFilter>("active");

  const setSearch = useCallback((next: string) => setSearchState(next), []);
  const setStatus = useCallback(
    (next: StatusFilter) => setStatusState(next),
    [],
  );

  const params: GetSitesParams = {
    search: search || undefined,
    status,
  };

  return { params, status, setSearch, setStatus };
}
