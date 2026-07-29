import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StateMessage } from "./StateMessage";

describe("StateMessage", () => {
  it("renders an accessible status message", () => {
    render(<StateMessage title="No comps found" message="Try a different filter." />);

    expect(screen.getByRole("status")).toHaveTextContent("No comps found");
    expect(screen.getByText("Try a different filter.")).toBeInTheDocument();
  });
});
