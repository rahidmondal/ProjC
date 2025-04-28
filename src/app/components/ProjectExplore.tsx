"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Card from "../components/Card";
import Pagination from "../components/Pagination";
import Link from "next/link";
import { listProjects } from "../services/projects";

interface Project {
  $id: string;
  projectName: string;
  projectProposerId: string;
  projectProposerName: string;
  description: string;
  skillsRequired: string[];
  teamSize: number;
  experience: string;
}

export default function ProjectExplore() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 6;



  useEffect(() =>{
    const fetchProject = async () =>{
      try{
        const projectList = await listProjects();
        setProjects(projectList);
      }catch(error){
        console.error("Error fetching projects:", error);
      }finally{
        setLoading(false);
      }
    }
    fetchProject();
  },[])
    

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = selectedFilter
      ? project.experience === selectedFilter
      : true;

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      project.projectName.toLowerCase().includes(search) ||
      project.skillsRequired.some((skill) =>
        skill.toLowerCase().includes(search)
      );

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <>
      {/* Search & Filter Section */}
      <section className="w-full max-w-[90%] mx-auto mt-10 px-6 grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
        {/* Search Input */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 border border-gray-400 rounded-full px-4 py-2 shadow-sm w-full max-w-[600px] focus-within:border-black transition-all">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or skill"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-transparent outline-none px-3 text-gray-700 dark:text-white"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {["All", "Novice", "Experienced", "Advanced"].map((filter) => (
            <button
              key={filter}
              className={`px-6 py-3 rounded-full transition-all shadow-md ${
                selectedFilter === filter ||
                (filter === "All" && selectedFilter === "")
                  ? "bg-[#8917BA] text-white"
                  : "border border-gray-500 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
              onClick={() => {
                setSelectedFilter(filter === "All" ? "" : filter);
                setCurrentPage(1);
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid with Pagination */}
      <div className="flex flex-col justify-start items-center min-h-screen px-6 md:px-12 py-8 md:py-12">
        {filteredProjects.length === 0 ? (
          <p className="text-center text-xl text-gray-500 font-semibold">
            No Projects Available
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {currentProjects.map((project) => (
              <Link href={`/project/${project.$id}`} key={project.$id}>
                <div className="hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                  <Card project={project} />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredProjects.length > itemsPerPage && (
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
