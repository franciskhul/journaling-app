import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/auth/login/page";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/next-auth/checkAuth";

class TestRedirectError extends Error {
  constructor(public url: string) {
    super(`Redirect to ${url}`);
  }
}

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  redirect: jest.fn().mockImplementation((url: string) => {
    throw new TestRedirectError(url);
  }),
  useRouter: jest.fn(),
}));

// Mock the components and hooks
jest.mock("@/lib/next-auth/checkAuth", () => ({
  checkAuth: jest.fn().mockResolvedValue({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
  }),
}));

jest.mock("@/components/login/login-form", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-login-form" />),
}));

describe("LoginPage", () => {
  const mockPush = jest.fn();
  const mockCheckAuth = checkAuth as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  describe("When unauthenticated", () => {
    beforeEach(() => {
      mockCheckAuth.mockResolvedValue({
        isAuthenticated: false,
        user: null,
      });
    });

    it("renders the login page correctly", async () => {
      const Page = await LoginPage();
      render(Page);

      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
      expect(
        screen.getByText("Continue your journaling journey")
      ).toBeInTheDocument();
      expect(screen.getByTestId("sparkles-icon")).toBeInTheDocument();
      expect(screen.getByTestId("mock-login-form")).toBeInTheDocument();
      expect(screen.getByText(/new to journal joy\?/i)).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Create an account" })
      ).toHaveAttribute("href", "/");
    });

    it("does not redirect", async () => {
      const Page = await LoginPage();
      render(Page);
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("When authenticated", () => {
    beforeEach(() => {
      mockCheckAuth.mockResolvedValue({
        isAuthenticated: true,
        user: {
          id: "123",
          email: "user@example.com",
          role: "USER",
        },
      });
    });

    it("redirects to /my-journal", async () => {
      let redirectError: TestRedirectError | undefined;

      try {
        const Page = await LoginPage();
        render(Page);
      } catch (err) {
        if (err instanceof TestRedirectError) {
          redirectError = err;
        }
      }

      expect(redirectError).toBeDefined();
      expect(redirectError?.url).toBe("/my-journal");
    });

    it("does not render the login form", async () => {
      let redirectError: TestRedirectError | undefined;
      let pageContent: React.ReactNode | null = null;

      try {
        const Page = await LoginPage();
        pageContent = Page;
      } catch (err) {
        if (err instanceof TestRedirectError) {
          redirectError = err;
        }
      }

      expect(redirectError).toBeDefined();
      expect(pageContent).toBeNull();
    });
  });
});
