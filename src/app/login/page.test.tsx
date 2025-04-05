import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '..login/page';
import { login, getCurrentUser } from '../services/auth';
import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/UserContext';

// Mock useRouter, login, getCurrentUser, and useUser
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../services/auth', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
}));

jest.mock('../contexts/UserContext', () => ({
  useUser: jest.fn(),
}));

describe('LoginPage', () => {
  const mockRouterPush = jest.fn();
  const mockRefetchUser = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    (useUser as jest.Mock).mockReturnValue({ refetchUser: mockRefetchUser });
    (getCurrentUser as jest.Mock).mockResolvedValue(null); // Default to no user logged in
    (login as jest.Mock).mockResolvedValue({ /* mock user object */ }); // Mock successful login
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByText(/New here?/i)).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockRefetchUser).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith('/user-profile');
    });
  });

  it('handles login error with invalid credentials', async () => {
    (login as jest.Mock).mockRejectedValue({ code: 401, message: 'Invalid credentials' });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password./i)).toBeInTheDocument();
    });

    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it('handles login error with other errors', async () => {
    (login as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Login failed: Network error/i)).toBeInTheDocument();
    });

    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  it('redirects to user-profile if user is already logged in', async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue({ /* mock user object */ });

    render(<LoginPage />);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/user-profile');
    });

    expect(screen.queryByRole('button', { name: /Login/i })).not.toBeInTheDocument();
  });

  it('displays loading message while login is in progress', async () => {
    (login as jest.Mock).mockImplementation(() => new Promise(() => {})); // Simulate pending promise

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(screen.getByRole('button', { name: /Logging in.../i })).toBeInTheDocument();
  });

  it('navigates to the register page when the register link is clicked', () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole('link', { name: /Create an account/i }));

    expect(mockRouterPush).toHaveBeenCalledWith('/register');
  });

  it('renders the correct logo based on theme', async () => {
    const mockUseTheme = jest.fn();
    jest.mock('next-themes', () => ({ useTheme: mockUseTheme }));

    mockUseTheme.mockReturnValue({ theme: 'dark' });
    render(<LoginPage />);
    let logo = screen.getByAltText(/Project Logo/i);
    expect(logo.src).toContain('lightLogo.png');

    mockUseTheme.mockReturnValue({ theme: 'light' });
    render(<LoginPage />);
    logo = screen.getByAltText(/Project Logo/i);
    expect(logo.src).toContain('darkLogo.png');

  });
});