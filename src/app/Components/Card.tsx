import Image from "next/image";

interface CardProps {
  imageSrc: string; // ✅ Image source as a prop
}

export default function Card({ imageSrc }: CardProps) {
  return (
    <div className="w-80 bg-gray-100 dark:bg-gray-900 shadow-lg rounded-xl border border-gray-500 dark:border-gray-500 p-6 text-center space-y-4 transition-colors duration-300">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        E-com Website
      </h2>

      {/* Image */}
      <div className="w-full h-44 relative rounded-lg overflow-hidden">
        <Image
          src={imageSrc} // ✅ Image now comes from props
          alt="E-com Website"
          width={320}
          height={176}
          className="rounded-lg object-cover"
        />
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        Developed a responsive e-commerce website
      </p>

      {/* Tags */}
      <div className="flex justify-center flex-wrap gap-2">
        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-4 py-2 rounded-full">
          React.js
        </span>
        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-4 py-2 rounded-full">
          Tailwind
        </span>
        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-4 py-2 rounded-full">
          SQL
        </span>
      </div>

      {/* Button */}
      <button className="w-full bg-[#8917BA] text-white font-bold py-3 rounded-lg hover:bg-[#6c0e9e] transition-all duration-300">
        Team-up !
      </button>
    </div>
  );
}
