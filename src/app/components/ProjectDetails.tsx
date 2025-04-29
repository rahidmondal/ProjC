"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Models } from "appwrite";
import { ArrowLeft, Mail } from "lucide-react";
import { getProject } from "../services/projects";
import { getUser } from "../services/users";
import { useUser } from "../contexts/UserContext";
import Link from "next/link";

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { profileUser } = useUser();
  const [project, setProject] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamedUp, setTeamedUp] = useState(false);
  const [proposerEmail, setProposerEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProject(id as string);
        setProject(response);

        if (response?.projectProposer) {
          try {
            const proposerData = await getUser(response.projectProposer);
            if (proposerData?.email) {
              setProposerEmail(proposerData.email);
            }
          } catch (err) {
            console.error("Error fetching proposer details:", err);
          }
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleContactClick = () => {
    if (!project || !proposerEmail) return;

    const projectNameSafe = project.projectName.replace(/[^\w\s-]/g, '');
    const subject = encodeURIComponent(`${projectNameSafe} interested`);

    const body = encodeURIComponent(
      `Hi there,\n\nI want to collaborate with you on this project "${project.projectName}".\n${profileUser?.name ? `\nRegards,\n${profileUser.name}` : ""
      }`
    );

    const gmailComposeUrl = `https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=${encodeURIComponent(proposerEmail)}&su=${subject}&body=${body}`;

    window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
  };
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black text-gray-800 dark:text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin-slow mb-4"></div>
        <p className="text-xl text-gray-600 dark:text-gray-300 animate-pulse">
          Fetching project details...
        </p>
      </div>
    );

  if (!project)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        Project not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-black text-gray-800 dark:text-white px-4 py-20">
      <div className="max-w-lg mx-auto bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition duration-200"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{project.projectName}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          <span className="font-semibold">Proposed by:</span>{" "}
          {project.projectProposer ? (
            <Link href={`/public-profile/${project.projectProposer}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              {project.projectProposerName || "Unknown User"}
            </Link>
          ) : (
            <span>{project.projectProposerName || "Unknown User"}</span>
          )}
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300">{project.description}</p>
        <div className="bg-gray-100 dark:bg-zinc-700 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Skills Required:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            {project.skillsRequired.map((skill: string, i: number) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-10 space-y-4 sm:space-y-0 text-gray-700 dark:text-gray-300">
          <p>
            <strong className="text-gray-900 dark:text-white">Experience Level:</strong>{" "}
            {project.experience}
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Team Size:</strong>{" "}
            {project.teamSize}
          </p>
        </div>

        {/* Action Buttons */}
        {/* Combine both Team Up and Contact into one button */}
        <div className="pt-1">
          <button
            onClick={() => {
              setTeamedUp(true);
              handleContactClick();
            }}
            disabled={teamedUp || !proposerEmail}
            className={`w-full text-lg flex items-center justify-center gap-3 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300
      ${teamedUp
                ? "bg-green-600 cursor-not-allowed"
                : proposerEmail
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            title={!proposerEmail ? "Email not available" : teamedUp ? "Already contacted" : "Team up and contact"}
          >
            {teamedUp ? (
              <>
                <span>👍</span>
                <span>Request Sent</span>
              </>
            ) : (
              <>
                <span>🤝</span>
                <Mail size={20} className="ml-1" />
                <span>Team Up & Contact</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}