"use client";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { authApi } from "@/configs/api";
import { noteKeys, outboundNoteKeys, stockKeys } from "@/configs/querykeys";
import type { AppError } from "@/errors";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import type { Paginated } from "@/types";
import { OutboundNoteSchema, VoidNoteSchema } from "./schemas";
import type {
  GetOutboundNotesParams,
  OutboundNote,
  OutboundNoteDetail,
  OutboundNoteInput,
} from "./types";
import { getTodayDateString } from "./utils";

export function useGetOutboundNotes(params: GetOutboundNotesParams = {}) {
  return useQuery<Paginated<OutboundNote>, AppError>({
    queryKey: outboundNoteKeys.filteredList(params),
    queryFn: async ({ signal }) => {
      const r = await authApi.get<Paginated<OutboundNote>>(
        (ep) => ep.outboundNotes.list,
        { params, signal },
      );
      return r.data;
    },
    placeholderData: keepPreviousData,
  });
}
export function useGetOutboundNote(id: number, opts?: { enabled?: boolean }) {
  return useQuery<OutboundNoteDetail, AppError>({
    ...opts,
    queryKey: outboundNoteKeys.detail(id),
    queryFn: async () => {
      const r = await authApi.get<OutboundNoteDetail>((ep) =>
        ep.outboundNotes.detail(id),
      );
      return r.data;
    },
  });
}
export function useAddOutboundNote(
  options?: Omit<
    UsePostOptions<typeof OutboundNoteSchema, OutboundNoteDetail, AppError>,
    "schema" | "mutationFn"
  >,
) {
  const qc = useQueryClient();
  return usePost({
    ...options,
    schema: OutboundNoteSchema,
    initialInput: {
      noteType: "issue_for_use",
      date: getTodayDateString(),
      warehouseId: null,
      siteId: null,
      toWarehouseId: null,
      note: "",
      lines: [{ materialId: null, quantity: "0", note: "" }],
    },
    mutationFn: async (data) => {
      const r = await authApi.post<OutboundNoteDetail>(
        (ep) => ep.outboundNotes.create,
        data,
      );
      return r.data;
    },
    onSuccess: (...a) => {
      qc.invalidateQueries({ queryKey: outboundNoteKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: stockKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: noteKeys.all, exact: false });
      options?.onSuccess?.(...a);
    },
  });
}
export function useUpdateOutboundNote(
  id: number,
  initialInput: OutboundNoteInput,
  options?: Omit<
    UsePostOptions<typeof OutboundNoteSchema, OutboundNoteDetail, AppError>,
    "schema" | "mutationFn" | "initialInput"
  >,
) {
  const qc = useQueryClient();
  return usePost({
    ...options,
    schema: OutboundNoteSchema,
    initialInput,
    mutationFn: async (data) => {
      const r = await authApi.put<OutboundNoteDetail>(
        (ep) => ep.outboundNotes.update(id),
        data,
      );
      return r.data;
    },
    onSuccess: (...a) => {
      qc.invalidateQueries({ queryKey: outboundNoteKeys.all, exact: false });
      options?.onSuccess?.(...a);
    },
  });
}
export function useDeleteOutboundNote() {
  const qc = useQueryClient();
  return useMutation<void, AppError, number>({
    mutationFn: async (id) => {
      await authApi.delete((ep) => ep.outboundNotes.delete(id));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: outboundNoteKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: noteKeys.all, exact: false });
    },
  });
}
export function useFinalizeOutboundNote(id: number) {
  const qc = useQueryClient();
  return useMutation<OutboundNoteDetail, AppError, void>({
    mutationFn: async () => {
      const r = await authApi.post<OutboundNoteDetail>((ep) =>
        ep.outboundNotes.post(id),
      );
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: outboundNoteKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: stockKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: noteKeys.all, exact: false });
    },
  });
}
export function useVoidOutboundNote(
  id: number,
  options?: Omit<
    UsePostOptions<typeof VoidNoteSchema, OutboundNoteDetail, AppError>,
    "schema" | "mutationFn"
  >,
) {
  const qc = useQueryClient();
  return usePost({
    ...options,
    schema: VoidNoteSchema,
    initialInput: { reason: "" },
    mutationFn: async (data) => {
      const r = await authApi.post<OutboundNoteDetail>(
        (ep) => ep.outboundNotes.void(id),
        data,
      );
      return r.data;
    },
    onSuccess: (...a) => {
      qc.invalidateQueries({ queryKey: outboundNoteKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: stockKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: noteKeys.all, exact: false });
      options?.onSuccess?.(...a);
    },
  });
}
