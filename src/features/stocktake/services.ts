"use client";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { authApi } from "@/configs/api";
import { noteKeys, stockKeys, stocktakeNoteKeys } from "@/configs/querykeys";
import type { AppError } from "@/errors";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import type { Paginated } from "@/types";
import { StocktakeNoteSchema, VoidNoteSchema } from "./schemas";
import type {
  GetStocktakeNotesParams,
  StocktakeNote,
  StocktakeNoteDetail,
  StocktakeNoteInput,
} from "./types";
import { getTodayDateString } from "./utils";

export function useGetStocktakeNotes(params: GetStocktakeNotesParams = {}) {
  return useQuery<Paginated<StocktakeNote>, AppError>({
    queryKey: stocktakeNoteKeys.filteredList(params),
    queryFn: async ({ signal }) => {
      const r = await authApi.get<Paginated<StocktakeNote>>(
        (ep) => ep.stocktakeNotes.list,
        { params, signal },
      );
      return r.data;
    },
    placeholderData: keepPreviousData,
  });
}
export function useGetStocktakeNote(id: number, opts?: { enabled?: boolean }) {
  return useQuery<StocktakeNoteDetail, AppError>({
    ...opts,
    queryKey: stocktakeNoteKeys.detail(id),
    queryFn: async () => {
      const r = await authApi.get<StocktakeNoteDetail>((ep) =>
        ep.stocktakeNotes.detail(id),
      );
      return r.data;
    },
  });
}
export function useAddStocktakeNote(
  options?: Omit<
    UsePostOptions<typeof StocktakeNoteSchema, StocktakeNoteDetail, AppError>,
    "schema" | "mutationFn"
  >,
) {
  const qc = useQueryClient();
  return usePost({
    ...options,
    schema: StocktakeNoteSchema,
    initialInput: {
      date: getTodayDateString(),
      warehouseId: null,
      note: "",
      lines: [{ materialId: null, difference: "0", reason: "", note: "" }],
    },
    mutationFn: async (data) => {
      const r = await authApi.post<StocktakeNoteDetail>(
        (ep) => ep.stocktakeNotes.create,
        data,
      );
      return r.data;
    },
    onSuccess: (...a) => {
      qc.invalidateQueries({ queryKey: stocktakeNoteKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: stockKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: noteKeys.all, exact: false });
      options?.onSuccess?.(...a);
    },
  });
}
export function useUpdateStocktakeNote(
  id: number,
  initialInput: StocktakeNoteInput,
  options?: Omit<
    UsePostOptions<typeof StocktakeNoteSchema, StocktakeNoteDetail, AppError>,
    "schema" | "mutationFn" | "initialInput"
  >,
) {
  const qc = useQueryClient();
  return usePost({
    ...options,
    schema: StocktakeNoteSchema,
    initialInput,
    mutationFn: async (data) => {
      const r = await authApi.put<StocktakeNoteDetail>(
        (ep) => ep.stocktakeNotes.update(id),
        data,
      );
      return r.data;
    },
    onSuccess: (...a) => {
      qc.invalidateQueries({ queryKey: stocktakeNoteKeys.all, exact: false });
      options?.onSuccess?.(...a);
    },
  });
}
export function useDeleteStocktakeNote() {
  const qc = useQueryClient();
  return useMutation<void, AppError, number>({
    mutationFn: async (id) => {
      await authApi.delete((ep) => ep.stocktakeNotes.delete(id));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stocktakeNoteKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: noteKeys.all, exact: false });
    },
  });
}
export function useFinalizeStocktakeNote(id: number) {
  const qc = useQueryClient();
  return useMutation<StocktakeNoteDetail, AppError, void>({
    mutationFn: async () => {
      const r = await authApi.post<StocktakeNoteDetail>((ep) =>
        ep.stocktakeNotes.post(id),
      );
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stocktakeNoteKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: stockKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: noteKeys.all, exact: false });
    },
  });
}
export function useVoidStocktakeNote(
  id: number,
  options?: Omit<
    UsePostOptions<typeof VoidNoteSchema, StocktakeNoteDetail, AppError>,
    "schema" | "mutationFn"
  >,
) {
  const qc = useQueryClient();
  return usePost({
    ...options,
    schema: VoidNoteSchema,
    initialInput: { reason: "" },
    mutationFn: async (data) => {
      const r = await authApi.post<StocktakeNoteDetail>(
        (ep) => ep.stocktakeNotes.void(id),
        data,
      );
      return r.data;
    },
    onSuccess: (...a) => {
      qc.invalidateQueries({ queryKey: stocktakeNoteKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: stockKeys.all, exact: false });
      qc.invalidateQueries({ queryKey: noteKeys.all, exact: false });
      options?.onSuccess?.(...a);
    },
  });
}
