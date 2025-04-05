import Link from "next/link";
import Image from "next/image";

interface SkillHubProps {
  userSkills: string[];
  recommendations: { name: string; link: string; category: string; image: string }[];
  loading: boolean;
}

const SkillHub = ({ userSkills, recommendations, loading }: SkillHubProps) => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">📚 Skill Hub</h1>
      <p className="text-lg mb-6 text-center">
        {loading
          ? "Fetching your personalized recommendations..."
          : userSkills.length > 0
          ? "Personalized resources to help you level up your coding skills."
          : "Here are some resources to get you started!"}
      </p>

      {loading ? (
        <p>Loading your personalized recommendations...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {recommendations.map((resource, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col justify-between h-96">
              <div className="relative w-full h-56 mb-4">
                <Image 
                  src={`/assets/${resource.image}`}  
                  alt={resource.name} 
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{resource.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{resource.category}</p>
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
  );
};

export default SkillHub;