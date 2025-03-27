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

  it("toggles password visibility", async () => {
    render(<RegistrationForm />);
    const passwordInput = screen.getByLabelText("Password");
    const confirmInput = screen.getByLabelText("Confirm Password");
    const toggleButtons = screen.getAllByRole("button", {
      name: /show password/i,
    });

    // Password should be hidden by default
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmInput).toHaveAttribute("type", "password");

    // Toggle password visibility
    await fireEvent.click(toggleButtons[0]);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(confirmInput).toHaveAttribute("type", "password");

    // Toggle confirm password visibility
    await fireEvent.click(toggleButtons[1]);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(confirmInput).toHaveAttribute("type", "text");

    // click again to hide
    await fireEvent.click(toggleButtons[0]);
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmInput).toHaveAttribute("type", "text");

    // Toggle confirm password visibility
    await fireEvent.click(toggleButtons[1]);
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmInput).toHaveAttribute("type", "password");
  });

  it("shows validation errors for empty form submission", async () => {
    render(<RegistrationForm />);
    const submitButton = screen.getByRole("button", {
      name: /Start Journaling/,
    });

    await fireEvent.click(submitButton);

    // Check all required field errors
    expect(
      await screen.findByText("Full name is required")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Please enter a valid email address")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Password must be at least 8 characters")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Please confirm your password")
    ).toBeInTheDocument();
  });

  it("validates password length", async () => {
    render(<RegistrationForm />);
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", {
      name: /start journaling/i,
    });

    await fireEvent.change(passwordInput, { target: { value: "shrt" } });

    await fireEvent.click(submitButton);

    expect(
      await screen.findByText("Password must be at least 8 characters")
    ).toBeInTheDocument();
  });

  it("validates password match", async () => {
    render(<RegistrationForm />);
    const passwordInput = screen.getByLabelText("Password");
    const confirmInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", {
      name: /Start Journaling/,
    });

    await fireEvent.change(passwordInput, { target: { value: "password123" } });
    await fireEvent.change(confirmInput, {
      target: { value: "differentpassword" },
    });

    await fireEvent.click(submitButton);

    expect(
      await screen.findByText("Passwords don't match")
    ).toBeInTheDocument();
  });
});
