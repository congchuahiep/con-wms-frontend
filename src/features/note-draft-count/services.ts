"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/configs/api";
import { noteKeys } from "@/configs/querykeys";
import type { AppError } from "@/errors";
import type { DraftNoteCount } from "./types";

/** Số phiếu nháp đang chờ xử lý, chia theo loại phiếu (nhập/xuất/kiểm kê). */
export function useGetDraftNoteCount() {
  return useQuery<DraftNoteCount, AppError>({
    queryKey: noteKeys.draftCount(),
    queryFn: async () => {
      const response = await authApi.get<DraftNoteCount>(
        (ep) => ep.notes.draftCount,
      );
      return response.data;
    },
  });
}
