"use client";
import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { IoConstruct } from "react-icons/io5";
import { useRouter } from "next/navigation";

const SkillTestPage = () => {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <IoConstruct className="text-6xl text-yellow-500 animate-pulse mb-4" />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Skill Test – Coming Soon!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          We are working hard to bring you the best skill test experience.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition"
        >
          Back to Home
        </button>
      </div>
    </ProtectedRoute>
  );
};

export default SkillTestPage;
