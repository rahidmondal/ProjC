"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SkillSelection = () => {
  const router = useRouter();
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("");

  const skills = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "React",
    "Angular",
    "Node.js",
    "HTML",
    "CSS",
  ];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (skill && level) {
      router.push(`/test-screen?skill=${skill}&level=${level}`);
    } else {
      alert("Please select a skill and level.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
        Select Skill and Level
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label
            htmlFor="skill"
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
          >
            Skill:
          </label>
          <select
            id="skill"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            required
          >
            <option value="">Select a skill</option>
            {skills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label
            htmlFor="level"
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
          >
            Level:
          </label>
          <select
            id="level"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          >
            <option value="">Select a level</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Start Test
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillSelection;