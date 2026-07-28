import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../components/Button";

describe("Button", () => {
  it("renders children and handles clicks", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
