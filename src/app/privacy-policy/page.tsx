"use client";

import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-600">Effective Date: 25/02/2025</p>
      <p className="text-gray-600 mb-6">Last Updated: 25/03/2025</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">1. Introduction</h2>
        <p>
          Welcome to <strong>ProjC</strong>. This is a student-led, open-source project designed 
          to help users share project ideas, find teammates, take skill assessments, and receive 
          learning recommendations.
        </p>
        <p>
          As a non-commercial academic project, we provide this platform <strong>as-is</strong>, 
          with no guarantees regarding data security or availability. By using ProjC, you accept 
          the terms of this Privacy Policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">2. Information We Collect</h2>
        <h3 className="font-medium mt-2">2.1. Information You Provide</h3>
        <ul className="list-disc pl-6">
          <li>Name (or username)</li>
          <li>Email address</li>
          <li>Profile details (e.g., skills, interests, and project ideas)</li>
          <li>Any voluntarily shared information</li>
        </ul>

        <h3 className="font-medium mt-2">2.2. Automatically Collected Data</h3>
        <ul className="list-disc pl-6">
          <li>General usage data (e.g., login timestamps, pages visited)</li>
          <li>Basic device information (e.g., browser type, operating system)</li>
          <li>Cookies or local storage for user preferences</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
        <p>We use your data solely for platform functionality, including:</p>
        <ul className="list-disc pl-6">
          <li>Facilitating user interactions (e.g., project postings, team formation)</li>
          <li>Providing skill assessments and recommendations</li>
          <li>Maintaining basic platform security and functionality</li>
        </ul>
        <p className="mt-2">
          We <strong>do not</strong> sell, rent, or monetize user data in any way.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">4. Data Storage & Security</h2>
        <p>
          ProjC stores data using third-party services (e.g., Appwrite). While we take reasonable 
          precautions, this platform is a <strong>student project</strong> and comes with 
          <strong> no guarantees</strong> of data security, reliability, or availability.
        </p>
        <strong><p>Users should avoid sharing sensitive or confidential data.</p></strong>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">5. Data Sharing & Disclosure</h2>
        <ul className="list-disc pl-6">
          <li>
            <strong>User Consent:</strong> Information that users voluntarily share (e.g., project posts) 
            will be publicly visible.
          </li>
          <li>
            <strong>Technical Needs:</strong> Data may be processed by third-party services for platform 
            functionality.
          </li>
          <li>
            <strong>Legal Obligations:</strong> If required by law, we may disclose limited user data.
          </li>
        </ul>
        <p className="mt-2">We do <strong>not</strong> engage in third-party advertising or marketing data sharing.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">6. Your Choices & Control</h2>
        <p>Users can control their data in the following ways:</p>
        <ul className="list-disc pl-6">
          <li><strong>Account Deletion:</strong> Users may request account and data deletion.</li>
          <li><strong>Profile Updates:</strong> Users can modify their profile and project details.</li>
          <li><strong>Opt-Out:</strong> Users may stop using the platform at any time.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">7. Cookies & Tracking</h2>
        <p>
          ProjC may use basic <strong>cookies</strong> or <strong>local storage</strong> to enhance 
          functionality. Users can disable cookies through browser settings, though some features 
          may not work properly.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">8. No Warranties & Limited Liability</h2>
        <p>
          ProjC is an <strong>experimental, non-commercial project</strong> provided <strong>as-is</strong> 
          with <strong>no warranties or guarantees</strong>. We are <strong>not liable</strong> for:
        </p>
        <ul className="list-disc pl-6">
          <li>Loss, leakage, or unauthorized access to user data</li>
          <li>Platform downtime, bugs, or data corruption</li>
          <li>Any disputes or misuse of the platform by other users</li>
        </ul>
        <p>Users assume full responsibility for their data and interactions on ProjC.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">9. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy periodically. Continued use of the platform after changes 
          means you accept the updated terms.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
