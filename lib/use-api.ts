"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/client";

// Standard data-loading hook for pages: fetch on mount (+ when `deps` change),
// exposing { data, loading, error, reload }. Keeps every page's fetch uniform.
// Simple global memory cache for API responses to implement Stale-While-Revalidate
const apiCache = new Map<string, any>();
const apiMetaCache = new Map<string, any>();

export function useApi<T>(path: string | null, deps: unknown[] = []) {
  // Initialize state with cached data if available to prevent loading flashes
  const cachedData = path ? apiCache.get(path) : null;
  const cachedMeta = path ? apiMetaCache.get(path) : null;

  const [data, setData] = useState<T | null>(cachedData);
  const [meta, setMeta] = useState<Record<string, unknown>>(cachedMeta || {});
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (path === null) {
      setLoading(false);
      return;
    }
    // Only show skeleton loader if we don't have cached data yet
    if (!apiCache.has(path)) {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await api<T>(path);
      setData(res.data);
      setMeta(res.meta);
      // Update cache with fresh data
      apiCache.set(path, res.data);
      apiMetaCache.set(path, res.meta);
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
