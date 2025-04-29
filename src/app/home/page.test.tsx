import { render, screen } from '@testing-library/react';
import HomePage from './page'; // Corrected import path for HomePage
import { useTheme } from 'next-themes';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

// Corrected import paths for mocked components with display names added
jest.mock('../components/Hero', () => {
  const Hero = () => <div>Hero Section</div>;
  Hero.displayName = 'Hero';
  return Hero;
});

jest.mock('../components/Herocurve', () => {
  const HeroCurve = () => <div>Hero Curve</div>;
  HeroCurve.displayName = 'HeroCurve';
  return HeroCurve;
});

jest.mock('./components/SupportedBy', () => {
  const SupportedBy = () => <div>Supported By</div>;
  SupportedBy.displayName = 'SupportedBy';
  return SupportedBy;
});

jest.mock('./components/Features', () => {
  const Features = () => <div>Features Section</div>;
  Features.displayName = 'Features';
  return Features;
});

jest.mock('./components/Mission_curve', () => {
  const MissionCurve = () => <div>Mission Curve</div>;
  MissionCurve.displayName = 'MissionCurve';
  return MissionCurve;
});

jest.mock('./components/Mission', () => {
  const Mission = () => <div>Mission Section</div>;
  Mission.displayName = 'Mission';
  return Mission;
});

jest.mock('./components/SkillAssessment', () => {
  const SkillAssessment = () => <div>Skill Assessment</div>;
  SkillAssessment.displayName = 'SkillAssessment';
  return SkillAssessment;
});

jest.mock('./components/ImageSection', () => {
  const ImageSection = () => <div>Image Section</div>;
  ImageSection.displayName = 'ImageSection';
  return ImageSection;
});

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
});
