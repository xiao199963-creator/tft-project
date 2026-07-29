import type {
  CompositionDetail,
  CompositionListResponse,
  MetaFilters,
  MetaSummary,
  PatchListResponse,
  SortKey,
  TrendResponse,
} from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export function buildQueryString({ filters, sort }: { filters: MetaFilters; sort?: SortKey }) {
  const params = new URLSearchParams();
  if (filters.patch) params.set("patch", filters.patch);
  if (filters.region) params.set("region", filters.region);
  if (filters.rankTier) params.set("rank_tier", filters.rankTier);
  if (filters.playstyle) params.set("playstyle", filters.playstyle);
  if (sort) params.set("sort", sort);
  const value = params.toString();
  return value ? `?${value}` : "";
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function fetchComps(filters: MetaFilters, sort: SortKey): Promise<CompositionListResponse> {
  return fetchJson(`/comps${buildQueryString({ filters, sort })}`);
}

export function fetchPatches(): Promise<PatchListResponse> {
  return fetchJson("/patches");
}

export function fetchMetaSummary(filters: MetaFilters): Promise<MetaSummary> {
  return fetchJson(`/stats/meta${buildQueryString({ filters })}`);
}

export function fetchCompDetail(slug: string, filters: MetaFilters): Promise<CompositionDetail> {
  return fetchJson(`/comps/${encodeURIComponent(slug)}${buildQueryString({ filters })}`);
}

export function fetchTrends(slug: string, filters: MetaFilters): Promise<TrendResponse> {
  return fetchJson(`/stats/trends/${encodeURIComponent(slug)}${buildQueryString({ filters })}`);
}
