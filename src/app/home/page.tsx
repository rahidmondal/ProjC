'use client';

import Hero from '../components/hero';
import SupportedBy from '../components/SupportedBy';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Mission from '../components/Mission';
import SkillAssessment from '../components/SkillAssessment';
import ImageSection from '../components/ImageSection';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="w-full overflow-hidden">
      <Hero />
      <SupportedBy />
      <Features />
      <Testimonials />
      <Mission />
      <SkillAssessment />
      <ImageSection />
      <CTA />
      <Footer />
    </div>
  );
}
