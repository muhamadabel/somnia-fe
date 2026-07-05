"use client";

import { api } from "@/lib/client";
import { getCached, setCache, getInflight, setInflight } from "@/lib/api-cache";

const ROUTE_TO_ENDPOINTS: Record<string, string[]> = {
  "/dashboard": ["/api/dashboard"],
  "/dreams": ["/api/dreams?page=1"],
  "/calendar": ["/api/dreams?limit=100&from=1970-01-01&to=2099-12-31"],
  "/trends": ["/api/trends?range=30"],
  "/gallery": ["/api/gallery"],
  "/symbols": ["/api/symbols"],
  "/reports": ["/api/reports"],
  "/community": ["/api/community/posts?page=1"],
  "/companion": ["/api/conversations"],
  "/notifications": ["/api/notifications"],
};

export function getEndpointsForRoute(pathname: string): string[] {
  const exact = ROUTE_TO_ENDPOINTS[pathname];
  if (exact) return exact;

  for (const [route, endpoints] of Object.entries(ROUTE_TO_ENDPOINTS)) {
    if (pathname.startsWith(route + "/") || pathname.startsWith(route + "?")) {
      return endpoints;
    }
  }
  return [];
}

export function prefetchRoute(pathname: string): void {
  const endpoints = getEndpointsForRoute(pathname);
  for (const endpoint of endpoints) {
    prefetchEndpoint(endpoint);
  }
}

export function prefetchEndpoint(path: string): void {
  if (!path) return;

  if (getCached(path) || getInflight(path)) return;

  const promise = api(path).then((res) => {
    setCache(path, res.data, res.meta);
    return res;
  });

  setInflight(path, promise);
}
