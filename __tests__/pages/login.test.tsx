import { render, screen /*, fireEvent*/ } from "@testing-library/react";
import LoginPage from "@/app/auth/login/page";
import { useRouter } from "next/navigation";

// Mock the components and hooks used in the page
jest.mock("next/navigation");
jest.mock("@/components/login/login-form", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-login-form" />),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockPush = jest.fn();

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    });
  });

  it("renders the login page correctly", () => {
    render(<LoginPage />);

    // Verify the main heading and subtitle
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(
      screen.getByText("Continue your journaling journey")
    ).toBeInTheDocument();

    // Verify the sparkle icon is present
    expect(screen.getByTestId("sparkles-icon")).toBeInTheDocument();

    // Verify the LoginForm component is rendered
    expect(screen.getByTestId("mock-login-form")).toBeInTheDocument();

    // Verify the registration link
    expect(screen.getByText(/new to journal joy\?/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Create an account" })
    ).toHaveAttribute("href", "/");
  });
});
