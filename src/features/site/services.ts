"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/configs/api";
import { siteKeys } from "@/configs/querykeys";
import type { AppError } from "@/errors";
import {
  type UsePartialUpdateOptions,
  usePartialUpdate,
} from "@/hooks/usePartialUpdate";
import { type UsePostOptions, usePost } from "@/hooks/usePost";
import { SiteSchema } from "./schemas";
import type { GetSitesParams, Site } from "./types";

export function useGetSites(params: GetSitesParams = {}) {
  return useQuery<Site[], AppError>({
    queryKey: siteKeys.filteredList(params),
    queryFn: async () => {
      const res = await authApi.get<Site[]>((ep) => ep.sites.list, {
        params,
      });
      return res.data;
    },
  });
}

export function useGetSite(id: number, options?: { enabled?: boolean }) {
  return useQuery<Site, AppError>({
    ...options,
    queryKey: siteKeys.detail(id),
    queryFn: async () => {
      const res = await authApi.get<Site>((ep) => ep.sites.detail(id));
      return res.data;
    },
  });
}

export function useAddSite(
  options?: Omit<
    UsePostOptions<typeof SiteSchema, Site, AppError>,
    "schema" | "mutationFn"
  >,
) {
  const qc = useQueryClient();
  return usePost({
    ...options,
    schema: SiteSchema,
    initialInput: {
      code: "",
      name: "",
      manager: "",
      phone: "",
      address: "",
      note: "",
    },
    mutationFn: async (data) => {
      const res = await authApi.post<Site>((ep) => ep.sites.create, data);
      return res.data;
    },
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: siteKeys.all, exact: false });
      options?.onSuccess?.(...args);
    },
  });
}

export function useUpdateSite(
  id: number,
  initialInput: Record<string, unknown>,
  options?: Omit<
    UsePartialUpdateOptions<typeof SiteSchema, Site>,
    "schema" | "mutationFn" | "initialInput" | "id"
  >,
) {
  const qc = useQueryClient();
  return usePartialUpdate({
    ...options,
    schema: SiteSchema,
    id,
    initialInput: initialInput as never,
    mutationFn: async ({ id: _id, ...data }) => {
      const res = await authApi.patch<Site>(
        (ep) => ep.sites.update(_id as number),
        data,
      );
      return res.data;
    },
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: siteKeys.all, exact: false });
      options?.onSuccess?.(...args);
    },
  });
}

export function useDeleteSite() {
  const qc = useQueryClient();
  return useMutation<void, AppError, number>({
    mutationFn: async (id) => {
      await authApi.delete((ep) => ep.sites.delete(id));
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: siteKeys.all, exact: false }),
  });
}
