"use client";

import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
      <p className="text-gray-600">Effective Date: 25/02/2025</p>
      <p className="text-gray-600 mb-6">Last Updated: 25/02/2025</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">1. Introduction</h2>
        <p>
          Welcome to <strong>ProjC</strong>, a platform created for users to share project 
          ideas, connect with teammates, take skill assessments, and receive learning 
          recommendations.
        </p>
        <p>
          By accessing or using ProjC, you agree to comply with these Terms. If you do not 
          agree, you should stop using the platform immediately.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">2. Use of the Platform</h2>
        <ul className="list-disc pl-6">
          <li>ProjC is intended for educational and collaboration purposes only.</li>
          <li>Users must maintain respectful and professional interactions.</li>
          <li>You are responsible for the content you post (e.g., project ideas, discussions).</li>
          <li>Do not share illegal, offensive, or copyrighted material.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">3. User Responsibilities</h2>
        <p>By using ProjC, you agree to:</p>
        <ul className="list-disc pl-6">
          <li>Provide accurate information when creating an account.</li>
          <li>Respect other users and avoid harassment or spam.</li>
          <li>Avoid any actions that could harm the platform’s functionality.</li>
          <li>Comply with all applicable laws when using ProjC.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">4. Content Ownership</h2>
        <p>
          Users retain ownership of the content they post on ProjC. However, by posting, 
          you grant ProjC a <strong>non-exclusive, royalty-free license</strong> to display 
          your content within the platform.
        </p>
        <p>We do not claim ownership over any project ideas or submissions.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">5. No Guarantees & Limited Liability</h2>
        <p>
          ProjC is a <strong>development-stage project</strong> provided <strong>as-is </strong> 
          without any guarantees. We do <strong>not</strong> guarantee:
        </p>
        <ul className="list-disc pl-6">
          <li>Uptime, reliability, or data availability.</li>
          <li>Accuracy of skill assessments or recommendations.</li>
          <li>Security of user data from external breaches.</li>
        </ul>
        <p>
          By using this platform, you acknowledge that <strong>we are not liable</strong> for 
          any issues related to ProjC, including lost data, incorrect recommendations, or 
          user disputes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">6. Account Suspension & Termination</h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate these Terms, 
          including users who:
        </p>
        <ul className="list-disc pl-6">
          <li>Engage in misconduct, spam, or harassment.</li>
          <li>Post misleading or harmful content.</li>
          <li>Attempt to exploit or harm the platform.</li>
        </ul>
        <p>
          Users can delete their accounts at any time. Once deleted, data may not be recoverable.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">7. Governing Law & Jurisdiction</h2>
        <p>
          These Terms are governed by the laws of India. Any disputes arising from 
          the use of ProjC shall be resolved under the exclusive jurisdiction of the 
          courts in New Delhi,India.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, ProjC, its creators, and contributors 
          shall not be liable for any direct, indirect, incidental, or consequential 
          damages arising from the use of the platform. 
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">9. Eligibility</h2>
        <p>
          Users must be at least 13 years old to use ProjC. If you are under 18, you must 
          have permission from a parent or guardian.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">10. Changes to These Terms</h2>
        <p>
          These Terms may be updated periodically. Continued use of the platform after changes 
          means you accept the updated Terms.
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditions;
