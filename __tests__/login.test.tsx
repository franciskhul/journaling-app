import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "@/app/auth/login/page";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

describe("LoginPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  it("renders the login page correctly", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("heading", { name: /login to your account/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /forgot password?/i })
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();

    expect(screen.getByRole("img", { name: /logo/i })).toBeInTheDocument();
  });

  it("submits the login form with correct credentials", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(toast).toHaveBeenCalledWith("Login successful. Welcome back!");

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("displays loading state when form is submitted", async () => {
    (signIn as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 1000)
        )
    );

    render(<LoginPage />);

    // Simulate user entering email and password
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Simulate form submission
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.click(loginButton);

    // Check if loading state (spinner) is displayed
    const loadingButton = await screen.findByRole("button", {
      name: /logging in.../i,
    });

    expect(loadingButton).toBeInTheDocument();

    // Wait for async actions
    await waitFor(() => {
      expect(signIn).toHaveBeenCalled();
    });

    await waitFor(() => {
      const buttonAfterSubmit = screen.getByRole("button", { name: /login/i });
      expect(buttonAfterSubmit).toBeInTheDocument();
    });
  });

  it("shows error message when login fails", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: "Invalid credentials" });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "wrong@example.com",
        password: "wrongpassword",
      });
    });

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("displays error messages when submitting without email or password", async () => {
    render(<LoginPage />);

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    const emailError = await screen.findByText(
      /please enter a valid email address/i
    );
    expect(emailError).toBeInTheDocument();

    const passwordError = await screen.findByText(/password is required/i);
    expect(passwordError).toBeInTheDocument();
  });
});

// // type MockSignInResponse =
// //   | { ok: true; error?: never }
// //   | { ok?: never; error: string };

// // const mockSignIn = jest.fn<
// //   Promise<MockSignInResponse>,
// //   [string, { email: string; password: string; redirect: boolean }]
// // >();

// // const mockPush = jest.fn<Promise<boolean>, [string]>();
// // // const mockPush: jest.Mock<Promise<boolean>, [string]> = jest.fn();
// // // const mockPush = jest.fn((path: string) => Promise.resolve(true));
// // // const mockPush = jest.fn() as jest.Mock<Promise<boolean>, [string]>;
// // // const mockSignIn = jest.fn();

// const mockPush = jest.fn<Promise<boolean>, [string]>();

// jest.mock("next/navigation", () => ({
//   useRouter: () => ({
//     push: mockPush,
//     replace: jest.fn(),
//     refresh: jest.fn(),
//   }),
// }));

// // jest.mock("next-auth/react", () => ({
// //   signIn: mockSignIn,
// // }));

// describe("LoginPage", () => {
//   beforeEach(() => {
//     mockPush.mockClear();
//   });
//   it("redirects on successful login", async () => {
//     // mockSignIn.mockResolvedValueOnce({ ok: true });

//     render(<LoginPage />);

//     fireEvent.change(screen.getByLabelText("Email"), {
//       target: { value: "test@example.com" },
//     });
//     fireEvent.change(screen.getByLabelText("Password"), {
//       target: { value: "password123" },
//     });
//     fireEvent.click(screen.getByRole("button", { name: /login/i }));

//     // expect(screen.getByText("Some element")).toBeInTheDocument();

//     // await waitFor(() => {
//     //   expect(mockPush).toHaveBeenCalledWith("/");
//     // });

//     // expect(mockSignIn).toHaveBeenCalledWith("credentials", {
//     //   email: "test@example.com",
//     //   password: "password123",
//     //   redirect: false,
//     // });
//   });
// });
