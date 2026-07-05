"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/client";
import { getCached, setCache, getInflight, setInflight } from "@/lib/api-cache";

export function useApi<T>(path: string | null, deps: unknown[] = []) {
  const cached = path ? getCached<T>(path) : null;

  const [data, setData] = useState<T | null>(cached?.data ?? null);
  const [meta, setMeta] = useState<Record<string, unknown>>(cached?.meta ?? {});
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (path === null) {
      setLoading(false);
      return;
    }

    if (!getCached(path)) {
      setLoading(true);
    }
    setError(null);

    try {
      const existing = getInflight(path);
      let res: { data: T; meta: Record<string, unknown>; message: string };
      if (existing) {
        res = await existing as any;
      } else {
        const promise = api<T>(path);
        setInflight(path, promise);
        res = await promise;
      }
      setData(res.data);
      setMeta(res.meta);
      setCache(path, res.data, res.meta);
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
