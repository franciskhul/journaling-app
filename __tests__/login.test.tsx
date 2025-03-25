import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "@/app/auth/login/page";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

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

    // expect(
    //   screen.getByRole("textbox", { name: /password/i })
    // ).toBeInTheDocument();

    expect(screen.getByRole("img", { name: /logo/i })).toBeInTheDocument();
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
