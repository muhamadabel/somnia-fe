"use client";

// Client-side API wrapper. Talks to the separate backend API over HTTP,
// authenticating with a Bearer token (docs/07 envelope).

import { clearToken, getToken } from "@/lib/session";
import { clearCache } from "@/lib/api-cache";

// Base URL of the backend API, e.g. https://be-somnia.hallojanu.xyz
// Empty string = same-origin (useful for local all-in-one dev).
export const API_BASE = "";

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  errors?: Array<{ field?: string; message: string }>;
}

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;
  constructor(status: number, message: string, errors: Array<{ field?: string; message: string }> = []) {
    super(message);
    this.status = status;
    this.fieldErrors = {};
    for (const e of errors) if (e.field) this.fieldErrors[e.field] = e.message;
  }
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit & { json?: unknown } = {}
): Promise<{ data: T; meta: Record<string, unknown>; message: string }> {
  const { json, ...init } = options;
  const token = getToken();
  const res = await fetch(API_BASE + path, {
    ...init,
    headers: {
      ...(json !== undefined ? { "content-type": "application/json" } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    body: json !== undefined ? JSON.stringify(json) : init.body,
  });

  // Expired/invalid session → drop the token and bounce to login.
  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
  }

  let body: ApiEnvelope<T>;
  try {
    body = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError(res.status, "Respons server tidak terduga. Coba lagi.");
  }
  if (!res.ok || !body.success) {
    throw new ApiError(res.status, body.message || "Permintaan gagal", body.errors ?? []);
  }
  
  const method = (init.method || "GET").toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    clearCache();
  }

  return { data: body.data as T, meta: body.meta ?? {}, message: body.message };
}

/** Absolute URL for a stored file (dream art, uploads) on the backend. */
export function fileUrl(path: string): string {
  return `${API_BASE}/api/files/${path}`;
}
