// src/app/components/ProfileSidebar.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, Github, Linkedin } from 'lucide-react';
import ProfileLink from './ProfileLink'; 
import { getUserImageUrl } from '../services/users'; 

interface ProfileSidebarProps {
  formData: {
    name: string;
    email: string;
    title: string;
    image?: string | null;
    website: string;
    github: string;
    linkedin: string;
  };
  onEditClick: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ formData, onEditClick }) => {
  return (
    <div className="w-full md:w-1/3 bg-white dark:bg-gray-700 shadow-md p-6 rounded-lg border border-gray-300 dark:border-gray-600 flex flex-col items-center flex-shrink-0">
      {/* Profile Image and Basic Info */}
      <div className="flex flex-col items-center text-center w-full">
        <Image
          src={formData.image ? getUserImageUrl(formData.image).toString() : "/assets/avatar_icon.png"}
          alt="Profile Picture"
          width={112}
          height={112}
          className="w-28 h-28 rounded-full border-4 border-gray-300 dark:border-gray-500 object-cover mb-4 bg-gray-200"
          key={formData.image || 'default-avatar'}
          priority
          onError={(e) => { e.currentTarget.src = "/assets/avatar_icon.png"; }}
        />
        <h2 className="text-xl font-semibold break-words">{formData.name || "User Name"}</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1 break-words">{formData.title || <span className="italic text-sm">No title</span>}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">{formData.email || "No email"}</p>
      </div>

      {/* Edit & Project Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-xs">
        <button
          className="flex-1 py-2 px-4 border border-gray-400 dark:bg-gray-600 dark:border-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition text-center font-medium"
          onClick={onEditClick}
        >
          Edit Profile
        </button>
        <Link href="/project-propose" className="flex-1">
          <button className="w-full py-2 px-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition">
            + Propose Project
          </button>
        </Link>
      </div>

      {/* Social Links */}
      <div className="mt-6 space-y-3 w-full max-w-xs">
        <ProfileLink Icon={Globe} label="Website" link={formData.website} />
        <ProfileLink Icon={Github} label="Github" link={formData.github} />
        <ProfileLink Icon={Linkedin} label="LinkedIn" link={formData.linkedin} />
      </div>
    </div>
  );
};