import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ProjectExplore from '..project-explore/page';
import ProtectedRoute from '../components/ProtectedRoute';
import ProjectExplorePage from '../components/ProjectExplore';

// Mock the ProtectedRoute and ProjectExplorePage components
jest.mock('../components/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="protected-route">{children}</div>,
}));

jest.mock('../components/ProjectExplore', () => ({
  __esModule: true,
  default: () => <div data-testid="project-explore-page">Project Explore Content</div>,
}));

describe('ProjectExplore', () => {
  it('renders the ProjectExplorePage within ProtectedRoute', () => {
    render(<ProjectExplore />);

    // Assert that ProtectedRoute is rendered
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();

    // Assert that ProjectExplorePage is rendered within ProtectedRoute
    expect(screen.getByTestId('project-explore-page')).toBeInTheDocument();
    expect(screen.getByTestId('protected-route')).toContainElement(screen.getByTestId('project-explore-page'));
  });

  it('renders the correct content within ProjectExplorePage', () => {
      render(<ProjectExplore />);
      expect(screen.getByTestId('project-explore-page')).toHaveTextContent('Project Explore Content');
  });
});