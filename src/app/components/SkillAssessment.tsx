import React from "react";
import Link from "next/link";

export default function SkillAssessment() {
  return (
    <section className="bg-gradient-to-r from-[rgba(71,71,71,255)] via-[rgba(14,14,14,255)] to-[rgba(66,66,66,255)] py-16 text-center text-white">
      <div className="container mx-auto px-6">
        <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
          &ldquo;Skills grow stronger when put to the test challenges reveal not just what you know, but what you&apos;re truly capable of.&rdquo;
        </p>
        <Link href="/skill-test">
        <button className="mt-6 px-6 py-3 bg-white text-black text-lg font-semibold rounded-full shadow-md hover:bg-gray-200 transition">
          Take the test
        </button>
        </Link>
      </div>
    </section>
  );
}