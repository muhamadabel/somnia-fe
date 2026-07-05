"use client";

interface CacheEntry<T> {
  data: T;
  meta: Record<string, unknown>;
  expiry: number;
}

const store = new Map<string, CacheEntry<any>>();
const inflight = new Map<string, Promise<unknown>>();

const DEFAULT_TTL = 60_000;

export function getCached<T>(key: string): { data: T; meta: Record<string, unknown> } | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    store.delete(key);
    return null;
  }
  return { data: entry.data as T, meta: entry.meta };
}

export function setCache<T>(key: string, data: T, meta: Record<string, unknown>, ttl = DEFAULT_TTL) {
  store.set(key, { data, meta, expiry: Date.now() + ttl });
}

export function clearCache() {
  store.clear();
}

export function isCached(key: string): boolean {
  const entry = store.get(key);
  if (!entry) return false;
  if (Date.now() > entry.expiry) {
    store.delete(key);
    return false;
  }
  return true;
}

export function getInflight(key: string): Promise<unknown> | undefined {
  return inflight.get(key);
}

export function setInflight<T>(key: string, promise: Promise<T>): Promise<T> {
  inflight.set(key, promise);
  promise.then(() => inflight.delete(key)).catch(() => inflight.delete(key));
  return promise;
}
