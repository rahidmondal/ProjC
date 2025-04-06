"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { databases } from "../../appwrite";
import { Models } from "appwrite";
import { ArrowLeft } from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamedUp, setTeamedUp] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await databases.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID!,
          id as string
        );
        setProject(response);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  if (loading)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin-slow mb-4"></div>
      <p className="text-xl text-gray-300 animate-pulse">Fetching project details...</p>
    </div>
  );



  if (!project)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        Project not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-zinc-800 p-8 rounded-2xl shadow-lg space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-200 transition duration-200"
        >
          <ArrowLeft size={20} />
          <span>Back to Explore</span>
        </button>

        <h1 className="text-4xl font-bold text-white">{project.projectName}</h1>
        <p className="text-gray-400 text-lg">
          <span className="font-semibold">Proposed by:</span>{" "}
          {project.projectProposer}
        </p>
        <p className="text-lg text-gray-300">{project.description}</p>

        <div className="bg-zinc-700 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-white">
            Skills Required:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {project.skillsRequired.map((skill: string, i: number) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-10 space-y-4 sm:space-y-0 text-gray-300">
          <p>
            <strong className="text-white">Experience Level:</strong>{" "}
            {project.experience}
          </p>
          <p>
            <strong className="text-white">Team Size:</strong>{" "}
            {project.teamSize}
          </p>
        </div>

        {/* Team Up Button */}
        <div className="pt-1 flex justify-center">
          <button
            onClick={() => setTeamedUp(true)}
            disabled={teamedUp}
            className={`w-48 flex items-center justify-center gap-2 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300
      ${
        teamedUp
          ? "bg-green-600 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
          >
            {teamedUp ? (
              <>
                <span>👍</span>
                <span>Sent</span>
              </>
            ) : (
              <>
                <span>🤝</span>
                <span>Team Up</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
