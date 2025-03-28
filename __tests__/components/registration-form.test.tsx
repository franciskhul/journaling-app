// __tests__/components/RegistrationForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegistrationForm from "@/components/registration/registration-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { z } from "zod";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(() => Promise.resolve({ error: null })),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("RegistrationForm", () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe("Frontend Validation Error", () => {
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

      await fireEvent.change(passwordInput, { target: { value: "invalid" } });

      await fireEvent.click(submitButton);

      expect(
        await screen.findByText("Password must be at least 8 characters")
      ).toBeInTheDocument();
    });

    it("validates password must contain at least one uppercase letter", async () => {
      render(<RegistrationForm />);
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", {
        name: /start journaling/i,
      });

      await fireEvent.change(passwordInput, {
        target: { value: "invalidpass" },
      });

      await fireEvent.click(submitButton);

      expect(
        await screen.findByText(/must contain at least one uppercase letter/i)
      ).toBeInTheDocument();
    });

    it("validates password must contain at least one lowercase letter", async () => {
      render(<RegistrationForm />);
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", {
        name: /start journaling/i,
      });

      await fireEvent.change(passwordInput, {
        target: { value: "INVALIDPASS" },
      });

      await fireEvent.click(submitButton);

      expect(
        await screen.findByText(/must contain at least one lowercase letter/i)
      ).toBeInTheDocument();
    });

    it("validates password must contain at least one number", async () => {
      render(<RegistrationForm />);
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", {
        name: /start journaling/i,
      });

      await fireEvent.change(passwordInput, {
        target: { value: "invalidPass" },
      });

      await fireEvent.click(submitButton);

      expect(
        await screen.findByText(/must contain at least one number/i)
      ).toBeInTheDocument();
    });

    it("validates password must contain at least one special character", async () => {
      render(<RegistrationForm />);
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", {
        name: /start journaling/i,
      });

      await fireEvent.change(passwordInput, {
        target: { value: "invalidPass10" },
      });

      await fireEvent.click(submitButton);

      expect(
        await screen.findByText(/must contain at least one special character/i)
      ).toBeInTheDocument();
    });

    it("validates password match", async () => {
      render(<RegistrationForm />);
      const passwordInput = screen.getByLabelText("Password");
      const confirmInput = screen.getByLabelText("Confirm Password");
      const submitButton = screen.getByRole("button", {
        name: /Start Journaling/,
      });

      await fireEvent.change(passwordInput, {
        target: { value: "invalidPass10;" },
      });
      await fireEvent.change(confirmInput, {
        target: { value: "differentPassword10;" },
      });

      await fireEvent.click(submitButton);

      expect(
        await screen.findByText("Passwords don't match")
      ).toBeInTheDocument();
    });
  });

  describe("Successful Registration Flow", () => {
    it("submits the form and signs in the user", async () => {
      // Mock successful registration response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            user: { id: "1", email: "test@example.com", role: "USER" },
            accessToken: "mock-token",
          }),
      });

      render(<RegistrationForm />);

      // Fill out the form using fireEvent
      fireEvent.change(screen.getByLabelText("Full Name"), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "ValidPass123!" },
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "ValidPass123!" },
      });

      // Submit the form
      fireEvent.click(screen.getByRole("button", { name: /Start Journaling/ }));

      // Verify API call
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/auth/registration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            password: "ValidPass123!",
          }),
        });
      });

      // Verify sign-in attempt
      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith("credentials", {
          email: "test@example.com",
          password: "ValidPass123!",
          redirect: false,
        });
      });

      // Verify success flow
      expect(toast.success).toHaveBeenCalledWith(
        "Account created and logged in successfully!"
      );
      expect(mockRouter.refresh).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/my-journal");
    });
  });

  describe("Error Handling", () => {
    it("handles sign-in error after successful registration", async () => {
      // Mock successful registration
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            user: { id: "1", email: "test@example.com", role: "USER" },
            accessToken: "mock-token",
          }),
      });

      // Mock failed sign-in
      (signIn as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({ error: "Login failed" })
      );

      render(<RegistrationForm />);

      // Fill out the form
      fireEvent.change(screen.getByLabelText("Full Name"), {
        target: { value: "Test User" },
      });
      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "ValidPass123!" },
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "ValidPass123!" },
      });

      // Submit the form
      fireEvent.click(screen.getByRole("button", { name: /Start Journaling/ }));

      // Verify error handling
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Login failed");
      });
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("handles 409 conflict error", async () => {
      // Mock 409 response
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: () => Promise.resolve({ error: "Email already registered" }),
      });

      render(<RegistrationForm />);

      // Fill out the form
      fireEvent.change(screen.getByLabelText("Full Name"), {
        target: { value: "Existing User" },
      });
      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "exists@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "ValidPass123!" },
      });
      fireEvent.change(screen.getByLabelText("Confirm Password"), {
        target: { value: "ValidPass123!" },
      });

      // Submit the form
      fireEvent.click(screen.getByRole("button", { name: /Start Journaling/ }));

      // Verify error handling
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Email already registered");
      });
      expect(signIn).not.toHaveBeenCalled();
    });
  });
});
