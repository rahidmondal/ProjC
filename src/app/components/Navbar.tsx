"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  // State to track dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Check localStorage for theme preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        setDarkMode(true);
      }
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-12 py-4 bg-white dark:bg-gray-900 shadow-md z-50 h-16">
      <div className="flex items-center">
        <Image
          src={darkMode ? "/assets/Lightlogo.png" : "/assets/Dark_logo_projc_1.png"}
          alt="Proj.C Logo"
          width={160}
          height={70}
          priority
        />
      </div>

      {pathname === "/home" && (
        <div className="hidden md:flex flex-1 justify-center space-x-10 text-gray-900 dark:text-white font-medium">
          <Link href="/home" className="relative font-semibold hover:text-purple-600 dark:hover:text-purple-400 transition-all">
            Home
            {pathname === "/home" && (
              <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-purple-600 dark:bg-purple-400"></span>
            )}
          </Link>
          <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-all font-semibold">
            Notifications
          </Link>
          <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-all font-semibold">
            Explore
          </Link>
          <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-all font-semibold">
            Profile
          </Link>
        </div>
      )}

      <div className="flex items-center space-x-6">
        {/* Toggle between sun and moon icon */}
        {darkMode ? (
          <IoSunnyOutline onClick={toggleDarkMode} className="text-2xl cursor-pointer text-yellow-400 hover:text-yellow-500 transition-all" />
        ) : (
          <IoMoonOutline onClick={toggleDarkMode} className="text-2xl cursor-pointer text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-all" />
        )}

        <button
          onClick={() => router.push("/login")}
          className="bg-purple-600 dark:bg-purple-700 text-white px-5 py-2 rounded-md hover:bg-purple-700 dark:hover:bg-purple-800 font-semibold shadow-md transition-all"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
