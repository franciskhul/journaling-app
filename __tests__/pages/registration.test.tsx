import { render, screen } from "@testing-library/react";
import RegistrationPage from "@/app/(registration)/page";

// Mock the RegistrationForm component
jest.mock("@/components/registration/registration-form", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-registration-form" />,
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("RegistrationPage", () => {
  beforeEach(() => {
    render(<RegistrationPage />);
  });

  it("displays the sparkle icon and heading", () => {
    const sparklesIcon = screen.getByTestId("sparkles-icon");
    expect(sparklesIcon).toBeInTheDocument();

    const heading = screen.getByText("Get Started");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("font-fugaz");
  });

  it("shows the subtitle text", () => {
    const subtitle = screen.getByText(/begin your journaling adventure today/i);
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveClass("font-alumni");
  });

  it("renders the RegistrationForm component", () => {
    expect(screen.getByTestId("mock-registration-form")).toBeInTheDocument();
  });

  it("displays the login link with correct styling", () => {
    const loginLink = screen.getByRole("link", { name: "Sign in instead" });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/auth/login");
    expect(loginLink).toHaveClass("text-amber-600");
    expect(loginLink).toHaveClass("hover:text-amber-800");
  });

  it("renders the visual section with correct content", () => {
    const visualSection = screen.getByTestId("visual-section");
    expect(visualSection).toBeInTheDocument();
    expect(visualSection).toHaveClass("bg-gradient-to-br");
    expect(visualSection).toHaveClass("from-amber-100");
    expect(visualSection).toHaveClass("to-amber-50");

    expect(screen.getByText("Your Story Begins Here")).toBeInTheDocument();
    expect(screen.getByText(/capture memories/i)).toBeInTheDocument();
  });

  it("applies the correct font classes", () => {
    expect(screen.getByText("Get Started")).toHaveClass("font-fugaz");
    expect(screen.getByText(/begin your journaling/i)).toHaveClass(
      "font-alumni"
    );
    expect(screen.getByText(/capture memories/i)).toHaveClass("font-alumni");
  });
});
