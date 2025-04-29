import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "./page"; // Corrected path to match the actual location
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
jest.mock("next/image", () => {
  const MockedImage = (props: JSX.IntrinsicElements["img"]) => {
    return <img {...props} alt={props.alt || "mocked-image"} />;
  };
  MockedImage.displayName = "MockedImage";
  return MockedImage;
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
});
