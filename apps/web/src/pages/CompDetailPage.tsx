import { useEffect, useState } from "react";
import { fetchCompDetail, fetchTrends } from "../api/client";
import { DetailLists } from "../components/DetailLists";
import { StateMessage } from "../components/StateMessage";
import { TrendChart } from "../components/TrendChart";
import type { CompositionDetail, MetaFilters, TrendPoint } from "../types";

type LoadState = "loading" | "ready" | "empty" | "error";

type CompDetailPageProps = {
  slug: string;
};

const filters: MetaFilters = {};
const numberFormatter = new Intl.NumberFormat("en-US");

function formatPercent(value: number) {
  return new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(value);
}

export default function CompDetailPage({ slug }: CompDetailPageProps) {
  const [detail, setDetail] = useState<CompositionDetail | null>(null);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let active = true;

    async function loadComposition() {
      setState("loading");
      try {
        const [detailResponse, trendResponse] = await Promise.all([
          fetchCompDetail(slug, filters),
          fetchTrends(slug, filters),
        ]);

        if (!active) return;
        if (!detailResponse) {
          setState("empty");
          return;
        }
        setDetail(detailResponse);
        setTrends(trendResponse.items);
        setState("ready");
      } catch {
        if (active) setState("error");
      }
    }

    void loadComposition();
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <main className="app-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Teamfight Tactics</p>
          <h1>Composition detail</h1>
        </div>
        <a className="back-link" href="/">All compositions</a>
      </header>

      {state === "loading" && (
        <StateMessage title="Loading composition" message="Fetching composition performance and patch history." />
      )}
      {state === "error" && (
        <StateMessage title="Unable to load composition" message="Please return to the dashboard and try again." />
      )}
      {state === "empty" && (
        <StateMessage title="Composition not found" message="This composition is not available for the selected filters." />
      )}
      {state === "ready" && detail && (
        <>
          <section className="detail-summary" aria-labelledby="composition-name">
            <div>
              <p className="eyebrow">{detail.playstyle} - {detail.difficulty}</p>
              <h2 id="composition-name">{detail.name}</h2>
              <p>{detail.summary}</p>
            </div>
            <dl className="detail-metrics">
              <div><dt>Meta score</dt><dd>{detail.meta_score.toFixed(1)}</dd></div>
              <div><dt>Average placement</dt><dd>{detail.stats.average_placement.toFixed(2)}</dd></div>
              <div><dt>Top-four rate</dt><dd>{formatPercent(detail.stats.top_four_rate)}</dd></div>
              <div><dt>Win rate</dt><dd>{formatPercent(detail.stats.win_rate)}</dd></div>
              <div><dt>Games</dt><dd>{numberFormatter.format(detail.stats.games)}</dd></div>
              <div><dt>Patch</dt><dd>{detail.stats.patch}</dd></div>
            </dl>
          </section>

          <section className="trend-section" aria-labelledby="trend-heading">
            <h2 id="trend-heading">Patch Trend</h2>
            {trends.length ? (
              <TrendChart trends={trends} />
            ) : (
              <StateMessage title="No trend data" message="Patch history is not available for this composition." />
            )}
          </section>

          <DetailLists
            units={detail.units}
            traits={detail.traits}
            items={detail.items}
            strengths={detail.strengths}
            weaknesses={detail.weaknesses}
            timingNotes={detail.timing_notes}
          />
        </>
      )}
    </main>
  );
}
