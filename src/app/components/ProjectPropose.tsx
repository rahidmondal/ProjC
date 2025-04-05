"use client";

import { useState } from "react";
import { databases, ID } from "../appwrite";
import { useRouter } from "next/navigation";


const ProjectPropose = () => {
  const [projectName, setProjectName] = useState("");
  const [proposerName, setProposerName] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState(["React.js", "Tailwind", "SQL"]);
  const [skillInput, setSkillInput] = useState("");
  const [teamSize, setTeamSize] = useState(4);
  const [score, setScore] = useState("Intermediate");
  const router = useRouter();
  
  const addSkill = () => {
    if (skillInput.trim() !== "" && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async () => {
    if (!projectName || !description) {
      alert("Project Name and Description are required");
      return;
    }
    try {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID!,
        ID.unique(),
        {
          projectName,
          projectProposer: proposerName,
          description,
          skillsRequired: skills,
          teamSize,
          
        }
      );
      alert("Project added successfully!");
      router.push("/project-explore");
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project.");
    }
  };

  return (
    <>
      <div className="w-full sm:w-2/5 mx-auto m-10 bg-gray-50 dark:bg-gray-800 border border-black dark:border-gray-500 p-5 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Add Project</h2>
        <hr className="w-full border-t-2 border-gray-400 mb-4" />

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Proposer Name
          </label>
          <input
            type="text"
            value={proposerName}
            onChange={(e) => setProposerName(e.target.value)}
            className="w-full border border-gray-400 dark:bg-gray-700 rounded-md px-3 py-2 mt-1 focus:border-black focus:ring-0"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full border border-gray-400 dark:bg-gray-700 rounded-md px-3 py-2 mt-1 focus:border-black focus:ring-0"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-400 dark:bg-gray-700 rounded-md px-3 py-2 mt-1 focus:border-black focus:ring-0"
          ></textarea>
        </div>

        {/* Skills Required */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Skills Required
          </label>
          <div className="flex flex-wrap gap-2 mt-2 px-4">
            {skills.map((skill) => (
              <div
                key={skill}
                className="bg-purple-300 text-black px-3 py-1 rounded-full flex items-center space-x-2"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-lg font-bold"
                >
                  +
                </button>
              </div>
            ))}
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()} // ✅ Listen for Enter key
              className="dark:bg-gray-700 border border-gray-400 w-full sm:w-28 rounded-full px-3 py-1 focus:border-black focus:border-[0.1px] focus:ring-0"
              placeholder="Add Skill"
            />
            <button
              onClick={addSkill}
              className="bg-purple-300 hover:bg-purple-400 transition-all px-3 py-1 rounded-3xl font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Team Size
          </label>
          <div className="flex gap-3 mt-2">
            {[2, 3, 4, 5].map((size) => (
              <button
                key={size}
                onClick={() => setTeamSize(size)}
                className={`px-4 py-2 border rounded-full ${
                  teamSize === size
                    ? "bg-purple-600 text-white"
                    : "border-gray-500 text-gray-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Score Required
          </label>
          <div className="flex gap-3 mt-2">
            {["Novice", "Intermediate", "Expert"].map((level) => (
              <button
                key={level}
                onClick={() => setScore(level)}
                className={`px-4 py-2 border rounded-full ${
                  score === level
                    ? "bg-purple-600 text-white"
                    : "border-gray-500 text-gray-700"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white text-lg font-semibold px-6 py-3 rounded-md hover:bg-purple-700"
          >
            Propose
          </button>
        </div>
      </div>
    </>
  );
};

export default ProjectPropose;
