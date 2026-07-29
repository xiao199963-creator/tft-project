import DashboardPage from "./pages/DashboardPage";
import CompDetailPage from "./pages/CompDetailPage";
import type { MetaFilters } from "./types";

function parseFilters(search: string): MetaFilters {
  const params = new URLSearchParams(search);
  return {
    patch: params.get("patch") || undefined,
    region: params.get("region") || undefined,
    rankTier: params.get("rank_tier") || params.get("rankTier") || undefined,
    playstyle: params.get("playstyle") || undefined,
  };
}

export default function App() {
  const compMatch = window.location.pathname.match(/^\/comps\/([^/]+)$/);
  return compMatch ? (
    <CompDetailPage slug={decodeURIComponent(compMatch[1])} filters={parseFilters(window.location.search)} />
  ) : <DashboardPage />;
}
