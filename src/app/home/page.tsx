"use client";

import { useTheme } from "next-themes"; 
import Hero from "../Components/hero";
import SupportedBy from "../Components/SupportedBy";
import Features from "../Components/Features";
import Mission_curve from "../Components/Mission_curve";
import Mission from "../Components/Mission";
import SkillAssessment from "../Components/SkillAssessment";
import ImageSection from "../Components/ImageSection";
import CTA from "../Components/CTA";
import Footer from "../Components/Footer";
import HeroCurve from "../Components/herocurve";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { theme } = useTheme();

  // ✅ Ensure theme is only applied after component is mounted to avoid SSR issues
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className={`w-full overflow-hidden transition-colors duration-300 ${mounted ? (theme === "dark" ? "dark bg-gray-900 text-white" : "bg-white text-gray-900") : ""}`}>
      <Hero />
      <HeroCurve />
      <SupportedBy />
      <Features />
      <Mission_curve />
      <Mission />
      <SkillAssessment />
      <ImageSection />
      <CTA />
      <Footer />
    </div>
  );
}
