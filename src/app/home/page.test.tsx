import { render, screen } from '@testing-library/react';
import HomePage from '..home/page'; 
import { useTheme } from 'next-themes';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

// Mock all child components to isolate the page logic
jest.mock('../components/Hero', () => () => <div>Hero Section</div>);
jest.mock('../components/Herocurve', () => () => <div>Hero Curve</div>);
jest.mock('../components/SupportedBy', () => () => <div>Supported By</div>);
jest.mock('../components/Features', () => () => <div>Features Section</div>);
jest.mock('../components/Mission_curve', () => () => <div>Mission Curve</div>);
jest.mock('../components/Mission', () => () => <div>Mission Section</div>);
jest.mock('../components/SkillAssessment', () => () => <div>Skill Assessment</div>);
jest.mock('../components/ImageSection', () => () => <div>Image Section</div>);

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all sections and applies dark theme class when theme is dark', () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: 'dark' });

    const { container } = render(<HomePage />);
    const textContent = screen.getByText('Hero Section');

    expect(textContent).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('dark');
    expect(container.firstChild).toHaveClass('bg-gray-900');
  });

  it('renders with light theme classes when theme is light', () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: 'light' });

    const { container } = render(<HomePage />);
    expect(container.firstChild).toHaveClass('bg-white');
    expect(container.firstChild).toHaveClass('text-gray-900');
  });
});
