import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PrivacyPolicy from './page';

describe('PrivacyPolicy', () => {
  it('renders the privacy policy page', () => {
    render(<PrivacyPolicy />);

    // Check for main heading
    expect(screen.getAllByRole('heading', { name: /Privacy Policy/i })[0]).toBeInTheDocument();

    // Check for effective date and last updated
    expect(screen.getByText(/Effective Date: 25\/02\/2025/i)).toBeInTheDocument();
    expect(screen.getByText(/Last Updated: 25\/03\/2025/i)).toBeInTheDocument();

    // Check for Introduction section
    expect(screen.getByRole('heading', { name: /Introduction/i })).toBeInTheDocument();
    expect(screen.getByText(/Welcome to ProjC./i)).toBeInTheDocument();

    // Check for Information We Collect section
    expect(screen.getByRole('heading', { name: /Information We Collect/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Information You Provide/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Automatically Collected Data/i })).toBeInTheDocument();
    expect(screen.getByText(/Name \(or username\)/i)).toBeInTheDocument();
    expect(screen.getByText(/General usage data/i)).toBeInTheDocument();

    // Check for How We Use Your Information section
    expect(screen.getByRole('heading', { name: /How We Use Your Information/i })).toBeInTheDocument();
    expect(screen.getByText(/We use your data solely for platform functionality/i)).toBeInTheDocument();
    expect(screen.getByText(/We do not sell, rent, or monetize user data in any way./i)).toBeInTheDocument();

    // Check for Data Storage & Security section
    expect(screen.getByRole('heading', { name: /Data Storage & Security/i })).toBeInTheDocument();
    expect(screen.getByText(/ProjC stores data using third-party services/i)).toBeInTheDocument();
    expect(screen.getByText(/Users should avoid sharing sensitive or confidential data./i)).toBeInTheDocument();

    // Check for Data Sharing & Disclosure section
    expect(screen.getByRole('heading', { name: /Data Sharing & Disclosure/i })).toBeInTheDocument();
    expect(screen.getByText(/User Consent:/i)).toBeInTheDocument();
    expect(screen.getByText(/Technical Needs:/i)).toBeInTheDocument();
    expect(screen.getByText(/Legal Obligations:/i)).toBeInTheDocument();
    expect(screen.getByText(/We do not engage in third-party advertising or marketing data sharing./i)).toBeInTheDocument();

    // Check for Your Choices & Control section
    expect(screen.getByRole('heading', { name: /Your Choices & Control/i })).toBeInTheDocument();
    expect(screen.getByText(/Account Deletion:/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile Updates:/i)).toBeInTheDocument();
    expect(screen.getByText(/Opt-Out:/i)).toBeInTheDocument();

    // Check for Cookies & Tracking section
    expect(screen.getByRole('heading', { name: /Cookies & Tracking/i })).toBeInTheDocument();
    expect(screen.getByText(/ProjC may use basic cookies or local storage to enhance functionality./i)).toBeInTheDocument();

    // Check for No Warranties & Limited Liability section
    expect(screen.getByRole('heading', { name: /No Warranties & Limited Liability/i })).toBeInTheDocument();
    expect(screen.getByText(/ProjC is an experimental, non-commercial project provided as-is with no warranties or guarantees./i)).toBeInTheDocument();
    expect(screen.getByText(/Users assume full responsibility for their data and interactions on ProjC./i)).toBeInTheDocument();

    // Check for Changes to This Privacy Policy section
    expect(screen.getByRole('heading', { name: /Changes to This Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getByText(/We may update this Privacy Policy periodically./i)).toBeInTheDocument();
  });
});