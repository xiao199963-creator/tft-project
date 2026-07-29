import { useEffect, useState } from "react";
import { fetchComps, fetchMetaSummary, fetchPatches } from "../api/client";
import { CompositionTable } from "../components/CompositionTable";
import { FilterBar } from "../components/FilterBar";
import { MetricCards } from "../components/MetricCards";
import { StateMessage } from "../components/StateMessage";
import type { CompositionSummary, MetaFilters, MetaSummary, Patch, SortKey } from "../types";

type LoadState = "loading" | "ready" | "empty" | "error";

const initialFilters: MetaFilters = {};
const initialSort: SortKey = "average_placement";

export default function DashboardPage() {
  const [filters, setFilters] = useState<MetaFilters>(initialFilters);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [patches, setPatches] = useState<Patch[]>([]);
  const [summary, setSummary] = useState<MetaSummary | null>(null);
  const [compositions, setCompositions] = useState<CompositionSummary[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [patchesLoaded, setPatchesLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPatches() {
      try {
        const patchResponse = await fetchPatches();
        if (!active) return;
        setPatches(patchResponse.items);
        const currentPatch = patchResponse.items.find((patch) => patch.is_current);
        if (currentPatch) {
          setFilters((currentFilters) => currentFilters.patch ? currentFilters : { ...currentFilters, patch: currentPatch.id });
        }
        setPatchesLoaded(true);
      } catch {
        if (active) setState("error");
      }
    }

    void loadPatches();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!patchesLoaded) return;
    let active = true;

    async function loadDashboard() {
      setState("loading");
      try {
        const [summaryResponse, compositionResponse] = await Promise.all([
          fetchMetaSummary(filters),
          fetchComps(filters, sort),
        ]);

        if (!active) return;
        setSummary(summaryResponse);
        setCompositions(compositionResponse.items);
        setState(compositionResponse.items.length ? "ready" : "empty");
      } catch {
        if (active) setState("error");
      }
    }

    void loadDashboard();
    return () => {
      active = false;
    };
  }, [filters, patchesLoaded, sort]);

  return (
    <main className="app-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Teamfight Tactics</p>
          <h1>TFT Meta Analytics</h1>
        </div>
      </header>

      <FilterBar
        filters={filters}
        sort={sort}
        patches={patches}
        onFiltersChange={setFilters}
        onSortChange={setSort}
      />

      {state === "loading" && (
        <StateMessage title="Loading meta data" message="Fetching the latest composition performance." />
      )}
      {state === "error" && (
        <StateMessage title="Unable to load meta data" message="Please try adjusting the filters again." />
      )}
      {state === "empty" && (
        <StateMessage title="No compositions found" message="Try a broader set of filters." />
      )}
      {state === "ready" && summary && (
        <>
          <MetricCards summary={summary} />
          <section className="composition-section" aria-labelledby="composition-heading">
            <h2 id="composition-heading">Composition performance</h2>
            <CompositionTable compositions={compositions} filters={filters} />
          </section>
        </>
      )}
    </main>
  );
}
