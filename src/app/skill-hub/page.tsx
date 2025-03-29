import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";

const LevelUp = () => {
  const dummyResources = [
    { name: "JavaScript Basics", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { name: "CSS Tricks", link: "https://css-tricks.com/" },
    { name: "React Docs", link: "https://react.dev/" },
    { name: "Next.js Guide", link: "https://nextjs.org/docs" },
  ];

  return (
    <ProtectedRoute>    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">🚧 Skill Hub - Under Construction 🚧</h1>
      <p className="text-lg mb-6 text-center"> We&apos;re working hard to bring you the best learning  experience and resources. Stay tuned!</p>
      <h2 className="text-2xl font-semibold mb-3">Meanwhile, check out these resources:</h2>
      <ul className="space-y-3">
        {dummyResources.map((resource, index) => (
          <li key={index}>
            <Link
              href={resource.link}
              target="_blank"
              className="text-blue-500 dark:text-blue-400 hover:underline"
            >
              {resource.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
    </ProtectedRoute>
  );
};

export default LevelUp;
