"use client";

import useSWR from "swr";
import { api, ApiError } from "@/lib/client";

interface ApiResponse<T> {
  data: T;
  meta: Record<string, any>;
  message: string;
}

const fetcher = async (key: string | any[]): Promise<ApiResponse<any>> => {
  const path = typeof key === "string" ? key : key[0];
  return api<any>(path);
};

export function useApi<T>(path: string | null, deps: unknown[] = []) {
  const key = path ? [path, ...deps] : null;

  const { data: swrResponse, error: swrError, mutate } = useSWR<ApiResponse<T>>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const loading = path !== null && !swrResponse && !swrError;
  const error = swrError ? (swrError instanceof ApiError ? swrError.message : "Gagal memuat data. Coba lagi.") : null;

  const reload = async () => {
    await mutate();
  };

  const setData = (newData: T) => {
    mutate(
      {
        data: newData,
        meta: swrResponse?.meta ?? {},
        message: swrResponse?.message ?? "",
      },
      false
    );
  };

  return {
    data: swrResponse?.data ?? null,
    meta: swrResponse?.meta ?? {},
    loading,
    error,
    reload,
    setData,
    mutate,
  };
}
