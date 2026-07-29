import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchTrends } from "../api/client";
import CompDetailPage from "./CompDetailPage";

vi.mock("../api/client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../api/client")>()),
  fetchCompDetail: vi.fn(async () => ({
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
    units: [{ name: "Jinx", cost: 4, role: "Carry", recommended_stars: 2, priority: 1 }],
    traits: [{ name: "Rebel", active_tier: "5", breakpoint_text: "5 Rebels active" }],
    items: [{ name: "Guinsoo's Rageblade", category: "Attack Speed", holder: "Jinx", priority: 1 }],
    strengths: ["Strong capped board"],
    weaknesses: ["Needs stable economy"],
    timing_notes: ["Push level 8 on 4-2 when healthy"],
  })),
  fetchTrends: vi.fn(async () => ({
    items: [
      { patch: "14.14", average_placement: 4.1, top_four_rate: 0.56, win_rate: 0.13, pick_rate: 0.08, games: 900 },
      { patch: "14.15", average_placement: 3.8, top_four_rate: 0.62, win_rate: 0.18, pick_rate: 0.11, games: 1200 },
    ],
  })),
}));

describe("CompDetailPage", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders composition detail and trend section", async () => {
    render(<CompDetailPage slug="rebel-fast-8" />);

    await waitFor(() => expect(screen.getByText("Rebel Fast 8")).toBeInTheDocument());
    expect(screen.getByText("Jinx")).toBeInTheDocument();
    expect(screen.getByText(/Patch Trend/i)).toBeInTheDocument();
  });

  it("does not pass the selected patch to the trend request", async () => {
    const { container } = render(<CompDetailPage slug="rebel-fast-8" filters={{ patch: "14.15", region: "OC1" }} />);

    await waitFor(() => expect(fetchTrends).toHaveBeenCalledWith("rebel-fast-8", { region: "OC1" }));
    expect(within(container).getByRole("link", { name: "All compositions" })).toHaveAttribute(
      "href",
      "/?patch=14.15&region=OC1",
    );
  });
});
