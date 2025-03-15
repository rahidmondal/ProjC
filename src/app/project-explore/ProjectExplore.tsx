"use client";

import React, { useState } from "react";
import Navbar from "../Components/Navbar/page";
import Footer from "../Components/Footer";
import { Search } from "lucide-react";
import Card from "../Components/Card";
import Pagination from "../Components/Pagination";

export default function ProjectExplore() {
  const projects = Array.from({ length: 18 }, (_, index) => index + 1); // ✅ 18 projects (3 pages)
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("Experienced"); // Default selected

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  // ✅ Assign different images for each page
  const images = {
    1: "/image1.png", // ✅ Page 1 cards
    2: "/image2.png", // ✅ Page 2 cards
    3: "/image3.png", // ✅ Page 3 cards
  };

  // Get projects for the current page
  const currentProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Search & Filter Section */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[87%] mx-auto mt-10 px-6">
        {/* Search Input */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 border border-gray-400 rounded-full px-4 py-2 shadow-sm w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[500px] focus-within:border-black transition-all">
          <span className="text-gray-500">
            <Search className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search projects"
            className="flex-grow bg-transparent outline-none px-3 text-gray-700 dark:text-white max-w-full lg:max-w-[250px] focus:ring-0 focus:border-black"
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
      <div className="flex flex-col justify-center items-center min-h-screen px-6 md:px-12 py-8 md:py-12">
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {currentProjects.map((_, index) => (
            <Card
              key={index}
              imageSrc={images[currentPage as keyof typeof images]}
            />
          ))}
        </div>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
