import { describe, expect, it } from "vitest";
import { buildQueryString } from "./client";

describe("buildQueryString", () => {
  it("omits empty filters and encodes selected filters", () => {
    const query = buildQueryString({
      filters: { patch: "14.15", region: "OC1", rankTier: "Diamond+", playstyle: "" },
      sort: "win_rate",
    });

    expect(query).toBe("?patch=14.15&region=OC1&rank_tier=Diamond%2B&sort=win_rate");
  });
});
