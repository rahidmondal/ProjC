

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "..register/Page"; 
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useUser } from "../contexts/UserContext";
import { register, getCurrentUser } from "../services/auth";

// Mocks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

jest.mock("../contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("../services/auth", () => ({
  register: jest.fn(),
  getCurrentUser: jest.fn(),
}));

// Silence next/image warning
jest.mock("next/image", () => (props: any) => {
  return <img {...props} alt={props.alt || "mocked-image"} />;
});

describe("RegisterPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: "light" });
    (useUser as jest.Mock).mockReturnValue({ refetchUser: jest.fn() });
    (getCurrentUser as jest.Mock).mockResolvedValue(null); // Not logged in
  });

  it("renders the form inputs", () => {
    render(<RegisterPage />);

    expect(screen.getByPlaceholderText("Enter Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Create Password")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeDisabled(); // not agreed yet
  });

  it("enables the submit button when terms are agreed", () => {
    render(<RegisterPage />);

    fireEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByText("Sign up")).not.toBeDisabled();
  });

  it("submits form and redirects on success", async () => {
    const mockRegister = register as jest.Mock;
    const mockRefetchUser = jest.fn();
    (useUser as jest.Mock).mockReturnValue({ refetchUser: mockRefetchUser });

    mockRegister.mockResolvedValue({ id: "123", name: "Test User" });

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("Enter Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Create Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByText("Sign up"));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith("Test User", "test@example.com", "password123");
      expect(mockRefetchUser).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/user-profile?edit=true");
    });
  });

  it("displays error if registration fails", async () => {
    (register as jest.Mock).mockRejectedValue(new Error("Registration error"));

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("Enter Name"), {
      target: { value: "Error User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Email"), {
      target: { value: "error@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Create Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByText("Sign up"));

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });

  it("redirects to profile if already logged in", async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue({ id: "123" });

    render(<RegisterPage />);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/user-profile");
    });
  });
});
