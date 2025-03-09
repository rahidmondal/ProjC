import Link from "next/link";
import { IoMoonOutline } from "react-icons/io5";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 w-full flex items-center justify-between px-12 py-4 bg-white z-50 h-16"
      style={{
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)", 
      }}
    >
      
      <div className="text-2xl font-extrabold text-purple-600 tracking-wide">
        PROJ.C
      </div>

      
      <div className="hidden md:flex flex-1 justify-center space-x-10 text-gray-900 font-medium">
        <Link
          href="/"
          className="relative hover:text-purple-600 transition-all font-semibold"
        >
          Home
          <span className="absolute left-1/2 transform -translate-x-1/2 w-full h-[2px] bg-purple-600 bottom-[-6px]"></span>
        </Link>
        <Link href="#" className="hover:text-purple-600 transition-all font-semibold">
          Notifications
        </Link>
        <Link href="#" className="hover:text-purple-600 transition-all font-semibold">
          Explore
        </Link>
        <Link href="#" className="hover:text-purple-600 transition-all font-semibold">
          Profile
        </Link>
      </div>

      
      <div className="flex items-center space-x-6">
        
        <IoMoonOutline className="text-2xl cursor-pointer text-gray-900 hover:text-purple-600 transition-all" />

        
        <Link
          href="#"
          className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 font-semibold shadow-md transition-all"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
