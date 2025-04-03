"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Card from "../components/Card";
import Pagination from "../components/Pagination";
import { databases } from "../appwrite";
import { Models } from "appwrite";

interface Project {
  $id: string;
  projectName: string;
  projectProposer: string;
  description: string;
  skillsRequired: string[];
  teamSize: number;
}

export default function ProjectExplore() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("");
  const itemsPerPage = 6;
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await databases.listDocuments<Models.Document>(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID!
        );

        if (response?.documents?.length > 0) {
          const projectList = response.documents.map((doc) => ({
            $id: doc.$id,
            projectName: doc.projectName,
            projectProposer: doc.projectProposer,
            description: doc.description,
            skillsRequired: doc.skillsRequired,
            teamSize: doc.teamSize,
          }));
          setProjects(projectList);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Get projects for the current page
  const currentProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <>
      {/* Search & Filter Section */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full max-w-[90%] mx-auto mt-10 px-6">
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 border border-gray-400 rounded-full px-4 py-2 shadow-sm w-full max-w-[600px] focus-within:border-black transition-all">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects"
            className="flex-grow bg-transparent outline-none px-3 text-gray-700 dark:text-white"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex w-full md:w-auto justify-center items-center space-x-4">
          {["Novice", "Experienced", "Advanced"].map((filter) => (
            <button
              key={filter}
              className={`px-6 py-3 rounded-full transition-all shadow-md ${
                selectedFilter === filter
                  ? "bg-[#8917BA] text-white"
                  : "border border-gray-500 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid with Pagination */}
      <div className="flex flex-col justify-start items-center min-h-screen px-6 md:px-12 py-8 md:py-12">
        {projects.length === 0 ? (
          <p className="text-center text-xl text-gray-500 font-semibold">
            No Projects Available
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {currentProjects.map((project) => (
              <Card key={project.$id} project={project} />
            ))}
          </div>
        )}

        {/* Pagination Component */}
        {projects.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

    </>
  );
}
