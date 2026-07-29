import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchComps, fetchMetaSummary } from "../api/client";
import DashboardPage from "./DashboardPage";

vi.mock("../api/client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../api/client")>()),
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
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders fetched meta data", async () => {
    render(<DashboardPage />);

    await waitFor(() => expect(screen.getByText("Rebel Fast 8")).toBeInTheDocument());
    expect(screen.getByText("1,200")).toBeInTheDocument();
  });

  it("loads the dashboard with the current patch selected", async () => {
    const { container } = render(<DashboardPage />);

    await waitFor(() => {
      expect(fetchMetaSummary).toHaveBeenCalledWith({ patch: "14.15" });
      expect(fetchComps).toHaveBeenCalledWith({ patch: "14.15" }, "average_placement");
    });
    expect(within(container).getByLabelText("Patch")).toHaveValue("14.15");
  });

  it("preserves active filters in composition detail links", async () => {
    const { container } = render(<DashboardPage />);
    const page = within(container);

    await waitFor(() => expect(page.getByText("Rebel Fast 8")).toBeInTheDocument());
    fireEvent.change(page.getByLabelText("Patch"), { target: { value: "14.15" } });
    fireEvent.change(page.getByLabelText("Region"), { target: { value: "OC1" } });
    fireEvent.change(page.getByLabelText("Rank tier"), { target: { value: "Diamond+" } });
    fireEvent.change(page.getByLabelText("Playstyle"), { target: { value: "Fast 8" } });

    await waitFor(() => {
      expect(page.getByRole("link", { name: "Rebel Fast 8" })).toHaveAttribute(
        "href",
        "/comps/rebel-fast-8?patch=14.15&region=OC1&rank_tier=Diamond%2B&playstyle=Fast+8",
      );
    });
  });
});
