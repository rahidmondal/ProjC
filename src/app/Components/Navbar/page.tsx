"use client";
import { useState, useEffect, useRef } from "react";
import {
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  Home,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(pathname);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // Track scrolling

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Handle outside clicks to close navbar & dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Detect scrolling to change navbar opacity
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menuItems = [
    { name: "Home", path: "/home-page" },
    { name: "Notifications", path: "/notifications" },
    { name: "Explore", path: "/project-explore" },
    { name: "Profile", path: "/user-profile" },
  ];

  const dropdownItems = [
    {
      name: "Home",
      path: "/home-page",
      icon: <Home className="w-5 h-5 mr-3 text-gray-500" />,
    },
    {
      name: "Profile",
      path: "/user-profile",
      icon: <User className="w-5 h-5 mr-3 text-gray-500" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="w-5 h-5 mr-3 text-gray-500" />,
    },
    {
      name: "Logout",
      path: "/logout",
      icon: <LogOut className="w-5 h-5 mr-3 text-red-500" />,
    },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 max-w-[95%] sm:max-w-[90%] md:max-w-[85%] lg:max-w-[87%] mx-auto mt-4 transition-all duration-300 
        ${
          isScrolled
            ? "bg-background bg-opacity-50 backdrop-blur-md shadow-md"
            : "bg-background"
        }
        before:absolute before:bottom-[-5px] before:left-0 before:w-full before:h-[5px] 
        before:shadow-[0px_8px_15px_rgba(0,0,0,0.4)] dark:before:shadow-[0px_8px_15px_rgba(255,255,255,0.2)] 
        before:content-[''] before:z-[-1]`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Logo */}
          <div className="w-32">
            {mounted && (
              <a href="/">
                <Image
                  src={
                    theme === "dark"
                      ? "/Light_logo_projc.png"
                      : "/Dark_logo_projc.png"
                  }
                  alt="Proj.C Logo"
                  width={200}
                  height={70}
                  priority
                />
              </a>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-gray-700 dark:text-gray-300">
            {menuItems.map((item) => (
              <div key={item.path} className="relative">
                <button
                  className={`hover:text-[#8917BA] ${
                    activeLink === item.path
                      ? "text-[#8917BA] font-semibold"
                      : ""
                  }`}
                  onClick={() => {
                    setActiveLink(item.path);
                    router.push(item.path);
                  }}
                >
                  {item.name}
                </button>
                {activeLink === item.path && (
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-purple-600 transition-all duration-300"></span>
                )}
              </div>
            ))}
          </div>

          {/* Icons (Dark Mode + Profile) */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            )}

            {/* Profile & Dropdown */}
            <div className="relative z-50" ref={dropdownRef}>
              <button
                className="flex items-center space-x-1 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src="/assets/profile.png"
                  alt="Profile"
                  className="w-8 h-8 rounded-full border"
                />
                <ChevronDown
                  className={`w-4 h-4 text-gray-700 dark:text-gray-300 transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-36 bg-white dark:bg-gray-800 shadow-md rounded-md p-2 z-50">
                  {dropdownItems.map((item) => (
                    <button
                      key={item.path}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push(item.path);
                      }}
                    >
                      {item.icon}
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden bg-background dark:bg-gray-800 transition-colors duration-300">
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`w-full text-left block px-6 py-3 ${
                  activeLink === item.path
                    ? "text-[#8917BA] border-l-4 border-[#8917BA]"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => {
                  setActiveLink(item.path);
                  router.push(item.path);
                  setMenuOpen(false);
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Add margin to content to prevent overlap */}
      <div className="mt-32"></div>
    </>
  );
};

export default Navbar;
