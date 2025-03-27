// __tests__/components/RegistrationForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistrationForm from "@/components/registration/registration-form";
// import RegistrationForm from "@/components/RegistrationForm";
import { toast } from "sonner";
import { z } from "zod";

// Mock the toast module
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("RegistrationForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields correctly", () => {
    render(<RegistrationForm />);

    // Check all form fields are present
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Start Journaling/ })
    ).toBeInTheDocument();
  });
});
