import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { RHFInput } from "@/shared/components/forms/RHFInput";

function TestForm() {
  // RHFInput already surfaces fieldState.error?.message as its own MUI
  // helperText — no need to render the error a second time here.
  const { control, handleSubmit } = useForm({ defaultValues: { email: "" } });
  return (
    <form onSubmit={handleSubmit(() => {})}>
      <RHFInput name="email" control={control} label="Email" rules={{ required: "Email is required." }} />
      <button type="submit">Submit</button>
    </form>
  );
}

describe("RHFInput", () => {
  it("renders a labeled text field and accepts input", async () => {
    render(<TestForm />);
    const input = screen.getByLabelText("Email");
    await userEvent.type(input, "jane@example.com");
    expect(input).toHaveValue("jane@example.com");
  });

  it("shows the rule's error message when submitted empty", async () => {
    render(<TestForm />);
    await userEvent.click(screen.getByText("Submit"));
    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
  });
});
