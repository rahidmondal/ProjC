"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUser, getUserImageUrl } from "../../services/users";
import {
  ProfileDisplaySection,
  renderSkills,
  renderSkillScores,
} from "../../components/ProfileDisplaySection";
import ProjectsSection from "../../components/ProjectSection";
import { User } from "../../types/user";
import { Models } from "appwrite";
import Image from "next/image";
import ProfileLink from "../../components/ProfileLink";
import { Globe, Github, Linkedin } from "lucide-react";

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState<(User & Models.Document) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      getUser(userId.toString()).then((data) => {
        if (data && 'userId' in data && 'name' in data && 'email' in data) {
          setUserData(data as User & Models.Document);
        } else if (data) {
          console.error("Received document is missing User properties", data);
          setUserData(null);
        } else {
          setUserData(null);
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
    <div className="my-10 flex flex-col md:flex-row justify-center items-start gap-6 px-4 dark:text-white">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/3 bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
        <Image
          src={userData.image ? getUserImageUrl(userData.image).toString() : "/default-avatar.png"}
          alt="Profile"
          width={128}
          height={128}
          className="w-32 h-32 rounded-full mx-auto object-cover"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = "/default-avatar.png";
          }} />
        <h2 className="text-xl text-center mt-4 font-semibold">
          {userData.name}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-300">
          {userData.title}
        </p>

        <div className="space-y-2 mt-4">
          <ProfileLink Icon={Globe} label="Website" link={userData.website} />
          <ProfileLink Icon={Linkedin} label="LinkedIn" link={userData.linkedin} />
          <ProfileLink Icon={Github} label="GitHub" link={userData.github} />
        </div>
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
          <ProjectsSection userId={userId.toString()} />
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;