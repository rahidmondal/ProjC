"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoMoonOutline, IoSunnyOutline, IoMenu, IoClose } from "react-icons/io5";
import { User, LogOut } from "lucide-react";
import Image from "next/image";
import { getCurrentUser, logout } from "../services/auth";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        setDarkMode(true);
      }
    }

    getCurrentUser().then(setUser);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/login");
  };

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

  const menuItems = [
    { name: "Home", path: "/home" },
    { name: "Explore", path: "/project-explore" },
    { name: "Profile", path: "/user-profile" },
  ];

  return (
    <nav className="sticky top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 py-4 bg-white dark:bg-gray-900 shadow-md z-50 h-16" ref={navRef}>
      <div className="flex items-center">
        <Image
          src={darkMode ? "/assets/Light_logo_projc.png" : "/assets/Dark_logo_projc.png"}
          alt="Proj.C Logo"
          width={160}
          height={70}
          priority
        />
      </div>
      <div className="hidden md:flex flex-1 justify-center space-x-10 text-gray-900 dark:text-white font-medium">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={`hover:text-purple-600 dark:hover:text-purple-400 font-semibold ${pathname.startsWith(item.path)
              ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
              : ""
              }`}
          >
            {item.name}
          </a>
        ))}
      </div>
      <div className="md:hidden flex items-center">
        {menuOpen ? (
          <IoClose
            className="text-3xl cursor-pointer text-gray-900 dark:text-white"
            onClick={() => setMenuOpen(false)}
          />
        ) : (
          <IoMenu
            className="text-3xl cursor-pointer text-gray-900 dark:text-white"
            onClick={() => setMenuOpen(true)}
          />
        )}
      </div>

      <div className="hidden md:flex items-center space-x-6">
        {darkMode ? (
          <IoSunnyOutline
            onClick={toggleDarkMode}
            className="text-2xl cursor-pointer text-yellow-400 hover:text-yellow-500"
          />
        ) : (
          <IoMoonOutline
            onClick={toggleDarkMode}
            className="text-2xl cursor-pointer text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400"
          />
        )}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2"
            >
              <Image
                src={user?.avatar || "/assets/avatar_icon.png"}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full border"
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-36 bg-white dark:bg-gray-800 shadow-md rounded-md p-2 z-50">
                {[{ name: "Profile", path: "/user-profile", icon: <User className="w-5 h-5 mr-3" /> },
                { name: "Logout", onClick: handleLogout, icon: <LogOut className="w-5 h-5 mr-3 text-red-500" /> }].map((item) => (
                  <button
                    key={item.path || item.name}
                    className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    onClick={() => {
                      setDropdownOpen(false);
                      if (item.onClick) {
                        item.onClick();
                      } else {
                        router.push(item.path);
                      }
                    }}
                  >
                    {item.icon}
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="bg-purple-600 dark:bg-purple-700 text-white px-5 py-2 rounded-md hover:bg-purple-700 dark:hover:bg-purple-800 font-semibold shadow-md"
          >
            Login
          </button>
        )}
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md p-4 flex flex-col items-center space-y-4 md:hidden">
          {menuItems.map((item) => (
            <a key={item.path} href={item.path} className="text-gray-900 dark:text-white font-medium" onClick={() => setMenuOpen(false)}>
              {item.name}
            </a>
          ))}
          <button onClick={toggleDarkMode} className="text-gray-900 dark:text-white font-medium">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          {user && (
            <button onClick={handleLogout} className="text-red-500 font-medium">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
