"use client";
import { useState } from "react";
import Navbar from "../Components/Navbar/page";
import Footer from "../Components/Footer";

const ProjectPropose = () => {
  const [skills, setSkills] = useState(["React.js", "Tailwind", "SQL"]);
  const [skillInput, setSkillInput] = useState("");
  const [teamSize, setTeamSize] = useState(4);
  const [score, setScore] = useState("Intermediate");

  const addSkill = () => {
    if (skillInput.trim() !== "" && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <>
      <Navbar />
      <div className="w-full sm:w-2/5  mx-auto m-10 bg-gray-50 dark:bg-gray-800 border border-black dark:border-gray-500 p-5 rounded-lg shadow-lg">
        {/* Header */}
        <h2 className="text-2xl font-bold mb-2">Add Project</h2>

        <hr className="w-full border-t-2 border-gray-400 mb-4" />

        {/* Project Name */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Project Name
          </label>
          <input
            type="text"
            className="w-full sm:w-96 border border-gray-400 dark:bg-gray-700 rounded-md px-3 py-2 mt-1 ml-4 focus:border-black focus:ring-0"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Description
          </label>
          <textarea className="w-full sm:w-96 border border-gray-400 dark:bg-gray-700 rounded-md px-3 py-2 mt-1 ml-4 focus:border-black focus:ring-0"></textarea>
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

        {/* Project Duration */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Project Duration
          </label>
          <div className="flex flex-wrap gap-3 mt-2 px-4">
            <select className="w-full sm:w-40 dark:bg-gray-700 border border-gray-400 rounded-md px-3 py-2 focus:border-black focus:ring-0">
              <option>Month</option>
            </select>
            <select className="w-full sm:w-40 dark:bg-gray-700 border border-gray-400 rounded-md px-3 py-2 focus:border-black focus:ring-0">
              <option>Year</option>
            </select>
          </div>
        </div>

        {/* Team Size */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Team Size
          </label>
          <div className="flex flex-wrap gap-3 mt-2 px-4">
            {[2, 3, 4, 5].map((size) => (
              <button
                key={size}
                onClick={() => setTeamSize(size)}
                className={`dark:text-white px-4 py-2 border rounded-full ${
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

        {/* Score Required */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold">
            Score Required
          </label>
          <div className="flex flex-wrap gap-3 mt-2 px-4">
            {["Novice", "Intermediate", "Expert"].map((level) => (
              <button
                key={level}
                onClick={() => setScore(level)}
                className={`dark:text-white px-4 py-2 border rounded-full ${
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

        {/* Propose Button */}
        <div className="mt-6">
          <button className="w-full bg-purple-600 text-white text-lg font-semibold px-6 py-3 rounded-md hover:bg-purple-700">
            Propose
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProjectPropose;
