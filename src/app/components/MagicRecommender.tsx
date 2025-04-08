"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface Recommendation {
  name: string;
  link: string;
  category: string;
  image: string;
}

interface Props {
  userSkills: string[];
  userScores: { [skill: string]: number } | undefined;
}

const MagicRecommender = ({ userSkills, userScores }: Props) => {
  const [magicRecs, setMagicRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMagic, setShowMagic] = useState(false);

  // Normalize skill names by removing special characters and lowercasing
  const normalizeSkill = (skill: string) =>
    skill.toLowerCase().replace(/[^a-z0-9]/gi, "");

  const handleMagicClick = async () => {
    setShowMagic(true);
    setLoading(true);
    try {
      const normalizedSkills = userSkills.map(normalizeSkill);

      console.log("Sending normalized skills to backend:", normalizedSkills);
      console.log("Sending scores to backend:", userScores);

      const payload = {
        skills: normalizedSkills || [],
        scores: userScores || {}, // fallback to empty object
      };

      const res = await fetch("http://localhost:8000/magic-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setMagicRecs(data.recommendations || []);
    } catch (err) {
      console.error("Error with magic fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowMagic(false);
  };

  return (
    <div className="w-full max-w-6xl">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleMagicClick}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition duration-200"
        >
          ✨ Magic Suggest
        </button>
      </div>

      {showMagic && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-6xl w-[90%] max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center">
              {loading
                ? "Crunching numbers and sprinkling AI dust..."
                : "Here’s what the algorithm thinks you’ll love!"}
            </h2>

            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {magicRecs.map((resource, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col justify-between h-96"
                  >
                    <div className="relative w-full h-56 mb-4">
                      <img
                        src={resource.image}
                        alt={resource.name}
                        className="rounded-t-lg w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {resource.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {resource.category}
                      </p>
                    </div>
                    <Link
                      href={resource.link}
                      target="_blank"
                      className="mt-auto bg-[#9334e9] text-white px-4 py-2 rounded-lg hover:bg-[#7e22ce] text-center"
                    >
                      Learn More
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MagicRecommender;
