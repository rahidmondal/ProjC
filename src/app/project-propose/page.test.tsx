import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ProjectPropose from './page'; // Corrected path to match the actual location

// Mock the ProtectedRoute component to always render children (bypass protection for testing)
jest.mock('../components/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the ProjectProposePage component
jest.mock('../components/ProjectPropose', () => ({
  __esModule: true,
  default: () => <div>Mocked Project Propose Page</div>,
}));

describe('ProjectPropose Page', () => {
  it('renders the ProjectProposePage inside ProtectedRoute', () => {
    render(<ProjectPropose />);
    expect(screen.getByText('Mocked Project Propose Page')).toBeInTheDocument();
  });
});
