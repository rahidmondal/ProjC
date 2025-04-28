"use client";

import React, { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import Link from "next/link";
import { listProjectsByUser } from "../services/projects"; // Correct path

interface Project {
  $id: string;
  projectName: string;
  description: string; 
  skillsRequired: string[]; 
}

interface ProjectsSectionProps {
  userId: string;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ userId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  console.log("[ProjectsSection] Received userId prop:", userId);

  useEffect(() => {
    if (!userId) {
      console.log("[ProjectsSection] No userId provided, skipping fetch.");
      setLoading(false);

      return;
    }

    const fetchUserProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await listProjectsByUser(userId);

        setProjects(response as Project[]); 


      } catch (err) {
        console.error("[ProjectsSection] Error fetching user projects:", err);
        setError("Failed to load projects.}"); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, [userId]); 



  if (loading) {
    return (
      <div className="text-gray-600 dark:text-gray-300 text-sm p-4">
        Loading projects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 text-sm p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-gray-600 shadow-md">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-3">
        <FolderOpen className="w-5 h-5" />
        <h4 className="text-md font-semibold">My Projects</h4> 
      </div>
      <div className="space-y-3"> 
        {projects.length === 0 ? (
          <p className="italic text-gray-500 dark:text-gray-400 text-sm">
            You haven&apos;t proposed any projects yet.
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project.$id}
              className="flex items-start space-x-3 py-2 border-b border-gray-800 dark:border-gray-800 last:border-0"
            >
              <div className="flex-grow">
                <Link href={`/project/${project.$id}`} className="hover:underline">
                  <p className="text-gray-800 dark:text-gray-100 text-sm font-medium mb-1">
                    {project.projectName}
                  </p>
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1">
                  {project.description || <span className="italic">No description.</span>}
                </p>
                {project.skillsRequired && project.skillsRequired.length > 0 && (
                   <div className="flex flex-wrap gap-1 mt-1">
                     {project.skillsRequired.slice(0, 5).map(skill => ( 
                       <span key={skill} className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-1.5 py-0.5 rounded">
                         {skill}
                       </span>
                     ))}
                   </div>
                )}
              </div>
              <Link href={`/project/${project.$id}`}>
                <span className="text-xs text-purple-600 hover:text-purple-800 dark:text-purple-300 cursor-pointer flex-shrink-0 mt-1">
                  View Details
                </span>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;