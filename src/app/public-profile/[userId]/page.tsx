// app/public-profile/[userId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserById } from "../../services/users"; // You need to create this function if it doesn't exist
import {
  ProfileDisplaySection,
  renderSkills,
  renderSkillScores,
} from "../../components/ProfileDisplaySection";
import ProjectsSection from "../../components/ProjectSection";

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      getUserById(userId.toString()).then((data) => {
        if (data) {
          setUserData(data);
        }
        setLoading(false);
      });
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  if (!userData) {
    return <div className="text-center mt-20 text-xl">User not found</div>;
  }

  return (
    <div className="my-10 flex justify-center items-start px-4 dark:text-white">
      <div className="w-full max-w-6xl bg-gray-100 dark:bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row gap-6 border border-gray-300 dark:border-gray-600 shadow-lg">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <img
            src={userData.image ? userData.image : "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto"
          />
          <h2 className="text-xl text-center mt-4 font-semibold">
            {userData.name}
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-300">
            {userData.title}
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3 py-4 px-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
          <ProfileDisplaySection title="About Me">
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm sm:text-base leading-relaxed">
              {userData.description || (
                <span className="italic text-gray-500 dark:text-gray-400">
                  No description provided.
                </span>
              )}
            </p>
          </ProfileDisplaySection>

          <ProfileDisplaySection title="Skills">
            {renderSkills(userData.skills)}
          </ProfileDisplaySection>

          <ProfileDisplaySection title="Skill Test Scores">
            {renderSkillScores(userData.skillScore)}
          </ProfileDisplaySection>

          <div className="mt-6">
            <ProjectsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
