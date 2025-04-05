"use client";

import { useTheme } from "next-themes"; 
import Hero from "../components/Hero";
import SupportedBy from "../components/SupportedBy";
import Features from "../components/Features";
import Mission_curve from "../components/Mission_curve";
import Mission from "../components/Mission";
import SkillAssessment from "../components/SkillAssessment";
import ImageSection from "../components/ImageSection";
import HeroCurve from "../components/Herocurve";
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
    </div>
  );
}
