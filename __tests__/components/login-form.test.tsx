// __tests__/components/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/components/login/login-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

jest.mock("next-auth/react");
jest.mock("sonner");
jest.mock("next/navigation");

const mockSignIn = signIn as jest.Mock;
const mockPush = jest.fn();

(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignIn.mockResolvedValue({ error: null });
  });

  it("renders the login form correctly", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue Journaling" })
    ).toBeInTheDocument();
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    render(<LoginForm />);
    const passwordInput = screen.getByLabelText("Password");
    const toggleButton = screen.getByRole("button", { name: /show password/i });

    // Password should be hidden by default
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click toggle button
    await fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click again to hide
    await fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("shows validation errors", async () => {
    render(<LoginForm />);

    // Submit empty form
    await fireEvent.click(
      screen.getByRole("button", { name: "Continue Journaling" })
    );

    // Check for validation messages
    expect(
      await screen.findByText("Please enter a valid email address")
    ).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    render(<LoginForm />);

    // Fill out form
    fireEvent.change(screen.getByLabelText(/email/i, { selector: "input" }), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(
      screen.getByLabelText(/password/i, { selector: "input" }),
      {
        target: { value: "password123" },
      }
    );
    fireEvent.click(
      screen.getByRole("button", { name: /continue journaling/i })
    );

    // // Check loading state
    // expect(screen.getByText("Signing In...")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(mockPush).toHaveBeenCalledWith("/my-journal");
  });

  it("handles login errors", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: "Invalid credentials" });
    render(<LoginForm />);

    // Fill out form
    fireEvent.change(screen.getByLabelText(/email/i, { selector: "input" }), {
      target: { value: "wrong@example.com" },
    });

    fireEvent.change(
      screen.getByLabelText(/password/i, { selector: "input" }),
      {
        target: { value: "wrongpassword" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Continue Journaling/i })
    );

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "wrong@example.com",
        password: "wrongpassword",
      });
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
