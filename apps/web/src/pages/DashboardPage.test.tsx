import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DashboardPage from "./DashboardPage";

vi.mock("../api/client", () => ({
  fetchComps: vi.fn(async () => ({
    items: [
      {
        id: "comp-001",
        name: "Rebel Fast 8",
        slug: "rebel-fast-8",
        playstyle: "Fast 8",
        difficulty: "Medium",
        summary: "Stable late-game board.",
        meta_score: 72.4,
        stats: {
          patch: "14.15",
          region: "OC1",
          rank_tier: "Diamond+",
          games: 1200,
          average_placement: 3.8,
          top_four_rate: 0.62,
          win_rate: 0.18,
          pick_rate: 0.11,
        },
      },
    ],
  })),
  fetchMetaSummary: vi.fn(async () => ({
    total_games: 1200,
    average_top_four_rate: 0.62,
    average_win_rate: 0.18,
    composition_count: 1,
  })),
  fetchPatches: vi.fn(async () => ({
    items: [{ id: "14.15", display_name: "Patch 14.15", release_date: "2026-07-10", is_current: true }],
  })),
}));

describe("DashboardPage", () => {
  it("renders fetched meta data", async () => {
    render(<DashboardPage />);

    await waitFor(() => expect(screen.getByText("Rebel Fast 8")).toBeInTheDocument());
    expect(screen.getByText("1,200")).toBeInTheDocument();
  });
});
