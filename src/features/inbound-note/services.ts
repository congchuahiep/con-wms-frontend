"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { authApi } from "@/configs/api";
import { inboundNoteKeys, stockKeys } from "@/configs/querykeys";
import type { AppError } from "@/errors";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import type { Paginated } from "@/types";
import { InboundNoteSchema, VoidNoteSchema } from "./schemas";
import type {
  GetInboundNotesParams,
  InboundNote,
  InboundNoteDetail,
  InboundNoteInput,
} from "./types";
import { getTodayDateString } from "./utils";

// GET list — phân trang, không kèm lines
export function useGetInboundNotes(params: GetInboundNotesParams = {}) {
  return useQuery<Paginated<InboundNote>, AppError>({
    queryKey: inboundNoteKeys.filteredList(params),
    queryFn: async ({ signal }) => {
      const response = await authApi.get<Paginated<InboundNote>>(
        (ep) => ep.inboundNotes.list,
        { params: params, signal },
      );
      return response.data;
    },
    // Giữ data của lần query trước khi đổi filter/phân trang để bảng
    // không bị xoá trắng + remount mỗi lần đổi param.
    placeholderData: keepPreviousData,
  });
}

// GET detail — kèm lines
export function useGetInboundNote(id: number, options?: { enabled?: boolean }) {
  return useQuery<InboundNoteDetail, AppError>({
    ...options,
    queryKey: inboundNoteKeys.detail(id),
    queryFn: async () => {
      const response = await authApi.get<InboundNoteDetail>((ep) =>
        ep.inboundNotes.detail(id),
      );
      return response.data;
    },
  });
}

// POST create — nested write (phiếu + lines), status luôn draft
export function useAddInboundNote(
  options?: Omit<
    UsePostOptions<typeof InboundNoteSchema, InboundNoteDetail, AppError>,
    "schema" | "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return usePost({
    ...options,
    schema: InboundNoteSchema,
    initialInput: {
      noteType: "purchase",
      date: getTodayDateString(),
      warehouseId: null,
      supplierId: null,
      note: "",
      lines: [
        {
          materialId: null,
          quantity: "0",
          note: "",
        },
      ],
    },
    mutationFn: async (data) => {
      const response = await authApi.post<InboundNoteDetail>(
        (ep) => ep.inboundNotes.create,
        data,
      );
      return response.data;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: inboundNoteKeys.all,
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: stockKeys.all,
        exact: false,
      });
      options?.onSuccess?.(...args);
    },
  });
}

/**
 * PUT update — replace-all: gửi FULL body (dòng cũ bị xóa, thay bằng `lines` mới).
 * Không dùng `usePartialUpdate` vì dirty-tracking sẽ bỏ sót `lines` khi user không sửa
 * → backend xóa sạch dòng. Chỉ áp dụng khi `status=draft`.
 */
export function useUpdateInboundNote(
  id: number,
  initialInput: InboundNoteInput,
  options?: Omit<
    UsePostOptions<typeof InboundNoteSchema, InboundNoteDetail, AppError>,
    "schema" | "mutationFn" | "initialInput"
  >,
) {
  const queryClient = useQueryClient();

  return usePost({
    ...options,
    schema: InboundNoteSchema,
    initialInput,
    mutationFn: async (data) => {
      const response = await authApi.put<InboundNoteDetail>(
        (ep) => ep.inboundNotes.update(id),
        data,
      );
      return response.data;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: inboundNoteKeys.all,
        exact: false,
      });
      options?.onSuccess?.(...args);
    },
  });
}

// DELETE — xóa cứng phiếu nháp (chưa có dòng sổ kho nên an toàn)
export function useDeleteInboundNote() {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, number>({
    mutationFn: async (id) => {
      await authApi.delete((ep) => ep.inboundNotes.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboundNoteKeys.all,
        exact: false,
      });
    },
  });
}

/**
 * Chốt phiếu (`POST /{id}/post/`) — backend ghi sổ kho trong cùng transaction.
 * Tồn kho + sổ kho thay đổi → invalidate cả 2 prefix.
 */
export function useFinalizeInboundNote(id: number) {
  const queryClient = useQueryClient();

  return useMutation<InboundNoteDetail, AppError, void>({
    mutationFn: async () => {
      const response = await authApi.post<InboundNoteDetail>((ep) =>
        ep.inboundNotes.post(id),
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboundNoteKeys.all,
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: stockKeys.all,
        exact: false,
      });
    },
  });
}

/**
 * Hủy phiếu (`POST /{id}/void/`) — bắt buộc lý do, backend ghi dòng sổ kho ngược dấu.
 * Dùng `usePost` để có form lý do + tự map lỗi field `reason`.
 */
export function useVoidInboundNote(
  id: number,
  options?: Omit<
    UsePostOptions<typeof VoidNoteSchema, InboundNoteDetail, AppError>,
    "schema" | "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return usePost({
    ...options,
    schema: VoidNoteSchema,
    initialInput: { reason: "" },
    mutationFn: async (data) => {
      const response = await authApi.post<InboundNoteDetail>(
        (ep) => ep.inboundNotes.void(id),
        data,
      );
      return response.data;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: inboundNoteKeys.all,
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: stockKeys.all,
        exact: false,
      });
      options?.onSuccess?.(...args);
    },
  });
}
