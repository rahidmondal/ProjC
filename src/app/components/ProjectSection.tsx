import React from "react";
import { FolderOpen } from "lucide-react";
import Link from "next/link";

const projects= [{
    id: "1",
    name: "E-commerce Website",
    status: "In Progress",
    color: "blue",
  },
  {
    id: "2",
    name: "Mobile App Design",
    status: "Completed",
    color: "green",
  },
];

// ProjectsSection Placeholder Component (Renders in the right section)
const ProjectsSection: React.FC = () => (
<div className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg border border-gray-300 dark:border-gray-600">
  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-3">
    <FolderOpen className="w-5 h-5"/>
    <h4 className="text-md font-bold">My Projects (Currently It Holds Placeholder)</h4>
  </div>
   {/* Placeholder Content */}
  <div className="space-y-2">
      {/* Example: Replace with map over actual project data */}
      {projects.map((project) => {
        return (
          <div
            key={project.id}
            className="flex items-center space-x-3 py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
          >
            <div className={`w-2.5 h-2.5 rounded-full bg-${project.color}-500 flex-shrink-0`}></div>
            <div className="flex-grow">
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                {project.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{project.status}</p>
            </div>
            {/* Optional: Link to project details */}
            <Link href={`/projects/${project.id}`}>
               <span className="text-xs text-purple-600 hover:underline cursor-pointer">View</span>
           </Link>
          </div>
        );
      })}
       {/* Message if no projects exist */}
       {projects.length === 0 && (
           <p className="italic text-gray-500 dark:text-gray-400 text-sm">No projects added yet.</p>
       )}
  </div>
</div>
);
export default ProjectsSection;