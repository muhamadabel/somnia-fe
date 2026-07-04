"use client";

// Client-side auth token store. The backend is a separate origin, so we use
// a Bearer token kept in localStorage (cross-origin cookies are unreliable).

const TOKEN_KEY = "somnia_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function hasToken(): boolean {
  return !!getToken();
}
