"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"; 
import { usePathname, useRouter } from "next/navigation";
import { IoMoonOutline, IoSunnyOutline, IoMenu, IoClose } from "react-icons/io5";
import { User, LogOut } from "lucide-react";
import Image from "next/image";
import { logout } from "../services/auth";
import { getUserImageUrl } from "../services/users"; 
import { useUser } from "./UserContext"; 

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);


  const { profileUser, isLoading, refetchUser } = useUser();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const theme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (theme === "dark" || (!theme && prefersDark)) {
        document.documentElement.classList.add("dark");
        setDarkMode(true);
      } else {
        document.documentElement.classList.remove("dark");
        setDarkMode(false);
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
         if(menuOpen) setMenuOpen(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]); 

  const handleLogout = async () => {
    setDropdownOpen(false); 
    setMenuOpen(false); 
    await logout();
    refetchUser(); 
    router.push("/login"); 
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
        const newMode = !prevMode;
        if (newMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
        return newMode;
    });
  };

  const handleMobileLinkClick = () => {
      setMenuOpen(false);
  }

  const menuItems = [
    { name: "Home", path: "/home" },
    { name: "Explore", path: "/project-explore" },
    { name: "Skill Hub", path: "/skill-hub" },
    ...(profileUser || !isLoading ? [{ name: "Profile", path: "/user-profile" }] : [])
  ];

  return (
    <nav className="sticky top-0 left-0 w-full flex items-center justify-between px-4 sm:px-6 md:px-12 py-2 md:py-4 bg-white dark:bg-gray-900 shadow-md z-50 h-16" ref={navRef}>
      {/* Logo */}
      <Link href="/home" className="flex items-center flex-shrink-0">
         <Image
            src={darkMode ? "/assets/Light_logo_projc.png" : "/assets/Dark_logo_projc.png"}
            alt="Proj.C Logo"
            width={150} 
            height={65}
            style={{ height: 'auto', width: 'auto', maxHeight: '48px' }} 
            priority
          />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-1 justify-center items-center space-x-8 lg:space-x-10 text-gray-700 dark:text-gray-300">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path} legacyBehavior>
             <a className={`text-sm lg:text-base font-semibold pb-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 ${pathname === item.path || (item.path !== '/home' && pathname.startsWith(item.path)) ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400" : "border-b-2 border-transparent"}`}>
                {item.name}
             </a>
          </Link>
        ))}
      </div>

       {/* Mobile Right Icons (Theme Toggle & Menu) */}
       <div className="flex items-center md:hidden gap-2">
         <button onClick={toggleDarkMode} aria-label="Toggle theme" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            {darkMode ? ( <IoSunnyOutline className="text-2xl text-yellow-400" /> ) : ( <IoMoonOutline className="text-2xl text-gray-700 dark:text-gray-300" /> )}
         </button>
         <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            {menuOpen ? ( <IoClose className="text-3xl text-gray-700 dark:text-gray-300" /> ) : ( <IoMenu className="text-3xl text-gray-700 dark:text-gray-300" /> )}
         </button>
       </div>


      {/* Desktop Right Section (Theme Toggle & User) */}
      <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
        <button onClick={toggleDarkMode} aria-label="Toggle theme" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            {darkMode ? ( <IoSunnyOutline className="text-2xl text-yellow-400" /> ) : ( <IoMoonOutline className="text-2xl text-gray-700 dark:text-gray-300" /> )}
        </button>

        {/* User Dropdown or Login Button */}
        {isLoading ? (
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div> // Simple loader
        ) : profileUser ? (
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" aria-label="User menu" aria-haspopup="true" aria-expanded={dropdownOpen}>
               <Image
                 src={profileUser?.image ? getUserImageUrl(profileUser.image).toString() : "/assets/avatar_icon.png"}
                 alt="Profile" width={32} height={32} className="rounded-full border border-gray-300 dark:border-gray-600"
                 onError={(e) => { e.currentTarget.src = "/assets/avatar_icon.png"; }} // Fallback
               />
            </button>
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 z-50 border dark:border-gray-700 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
                 <Link href="/user-profile" legacyBehavior>
                    <a className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem" tabIndex={-1} onClick={() => setDropdownOpen(false)}>
                       <User className="w-4 h-4 mr-2" /> Profile
                    </a>
                 </Link>
                 <button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem" tabIndex={-1}
                    onClick={handleLogout}>
                   <LogOut className="w-4 h-4 mr-2 text-red-500" /> Logout
                 </button>
              </div>
            )}
          </div>
        ) : (
          // Show Login Button if not loading and no user
          <button onClick={() => router.push("/login")} className="bg-purple-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors duration-200 shadow">
            Login
          </button>
        )}
      </div>

       {/* Mobile Menu Overlay */}
       <div className={`absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-md py-4 flex flex-col items-center space-y-3 md:hidden transition-transform duration-300 ease-in-out transform ${menuOpen ? 'translate-y-0' : '-translate-y-full'} -z-10`}>
            {menuItems.map((item) => (
                <Link key={item.path} href={item.path} legacyBehavior>
                <a className="text-gray-800 dark:text-gray-200 font-medium py-2 hover:text-purple-600 dark:hover:text-purple-400" onClick={handleMobileLinkClick}>
                    {item.name}
                </a>
                </Link>
            ))}
            <hr className="w-1/2 border-gray-200 dark:border-gray-700"/>
            {profileUser && (
            <button onClick={handleLogout} className="text-red-500 font-medium py-2 flex items-center gap-2">
                <LogOut className="w-4 h-4"/> Logout
            </button>
            )}
            {!profileUser && !isLoading && ( 
                <button onClick={() => { router.push("/login"); handleMobileLinkClick(); }} className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 font-semibold shadow w-full max-w-xs mt-2">
                    Login
                </button>
            )}
       </div>
    </nav>
  );
};

export default Navbar;