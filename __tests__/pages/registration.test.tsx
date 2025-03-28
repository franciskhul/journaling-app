import { render, screen } from "@testing-library/react";
import RegistrationPage from "@/app/(registration)/page";
import { checkAuth } from "@/lib/next-auth/checkAuth";
import { redirect } from "next/navigation";

// Custom error for testing redirects
class TestRedirectError extends Error {
  constructor(public url: string) {
    super(`Redirect to ${url}`);
  }
}

// Mock the components
jest.mock("@/components/registration/registration-form", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-registration-form" />,
}));

jest.mock("@/lib/next-auth/checkAuth", () => ({
  checkAuth: jest.fn().mockResolvedValue({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
  }),
}));
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  redirect: jest.fn().mockImplementation((url: string) => {
    throw new TestRedirectError(url);
  }),
  useRouter: jest.fn(),
}));

describe("RegistrationPage", () => {
  const mockCheckAuth = checkAuth as jest.Mock;
  const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

  beforeEach(() => {
    mockRedirect.mockImplementation((url: string) => {
      throw new TestRedirectError(url);
    });
    jest.clearAllMocks();
  });

  describe("When unauthenticated", () => {
    beforeEach(() => {
      mockCheckAuth.mockResolvedValue({
        isAuthenticated: false,
        user: null,
      });
    });

    it("renders the registration page", async () => {
      const Page = await RegistrationPage();
      render(Page);

      expect(screen.getByText("Get Started")).toBeInTheDocument();
      expect(screen.getByTestId("mock-registration-form")).toBeInTheDocument();
    });

    it("shows the login link", async () => {
      const Page = await RegistrationPage();
      render(Page);

      const loginLink = screen.getByRole("link", { name: "Sign in instead" });
      expect(loginLink).toHaveAttribute("href", "/auth/login");
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
        const Page = await RegistrationPage();
        render(Page);
      } catch (err) {
        if (err instanceof TestRedirectError) {
          redirectError = err;
        }
      }

      expect(redirectError).toBeDefined();
      expect(redirectError?.url).toBe("/my-journal");
    });

    it("does not render registration form when redirected", async () => {
      let pageContent: React.ReactNode | null = null;

      try {
        const Page = await RegistrationPage();
        pageContent = Page;
      } catch {
        // We expect an error from the redirect
      }

      expect(pageContent).toBeNull();
    });
  });
});
