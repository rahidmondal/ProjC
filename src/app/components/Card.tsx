"use client";

import React from "react";

interface Project {
  $id: string;
  projectName: string;
  description: string;
  projectProposer: string;
  skillsRequired: string[];
  teamSize: number;
}

interface CardProps {
  project: Project;
}

const Card: React.FC<CardProps> = ({ project }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 border border-gray-400 dark:border-gray-700 rounded-xl p-6 w-full max-w-sm text-center shadow-lg transition-all duration-300">
      {/* Title */}
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
        {project.projectName}
      </h2>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 text-md mb-4">
        {project.description}
      </p>

      {/* Proposer */}
      <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
        <span className="font-semibold">Proposed by:</span>{" "}
        {project.projectProposer}
      </p>

      {/* Team Size */}
      <p className="text-sm text-gray-600 dark:text-gray-400 my-2 text-left">
        <span className="font-semibold">Team Size:</span> {project.teamSize}
      </p>

      {/* Skills Required */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {project.skillsRequired.map((skill, index) => (
          <span
            key={index}
            className="bg-purple-500 dark:bg-purple-700 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Team-up Button */}
      <button className="bg-purple-600 dark:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-purple-700 dark:hover:bg-purple-600 transition-all">
        Team-up !
      </button>
    </div>
  );
};

export default Card;
