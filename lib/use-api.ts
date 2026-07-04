"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/client";

// Standard data-loading hook for pages: fetch on mount (+ when `deps` change),
// exposing { data, loading, error, reload }. Keeps every page's fetch uniform.
export function useApi<T>(path: string | null, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [meta, setMeta] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (path === null) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api<T>(path);
      setData(res.data);
      setMeta(res.meta);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Gagal memuat data. Coba lagi.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, meta, loading, error, reload, setData };
}
