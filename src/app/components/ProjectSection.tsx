"use client";

import React, { useEffect, useState } from "react";
import { FolderOpen } from "lucide-react";
import Link from "next/link";
import { account, databases } from "../appwrite"; // Adjust path as needed
import { Models, Query } from "appwrite";

interface Project {
  $id: string;
  projectName: string;
  status: string;
  color: string;
}

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);

        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID!,
          [Query.equal("projectProposer", user.$id)]
        );

        // Replace these values with actual fields from your DB
        const userProjects: Project[] = response.documents.map((doc: any) => ({
          $id: doc.$id,
          projectName: doc.projectName,
          status: "In Progress", // or fetch from your DB
          color: "blue", // or based on status
        }));

        setProjects(userProjects);
      } catch (error) {
        console.error("Error fetching user projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, []);

  if (loading) {
    return (
      <div className="text-gray-600 dark:text-gray-300 text-sm">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg border border-gray-300 dark:border-gray-600">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-3">
        <FolderOpen className="w-5 h-5" />
        <h4 className="text-md font-bold">My Projects</h4>
      </div>
      <div className="space-y-2">
        {projects.length === 0 ? (
          <p className="italic text-gray-500 dark:text-gray-400 text-sm">
            No projects added yet.
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project.$id}
              className="flex items-center space-x-3 py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full bg-${project.color}-500 flex-shrink-0`}
              ></div>
              <div className="flex-grow">
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {project.projectName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {project.status}
                </p>
              </div>
              <Link href={`/project/${project.$id}`}>
                <span className="text-xs text-purple-600 hover:underline cursor-pointer">
                  View
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
