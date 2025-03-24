"use client";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 ">
      <div className="bg-gray-800 flex items-center justify-between   pt-6 px-8 text-center text-gray-300">
        <p className=" pb-6">© 2025 Proj.C. All rights reserved.</p>
        <div className=" flex justify-center items-center pb-6 space-x-6">
          <a href="./terms-of-service" className="hover:text-white">
            Terms of Service
          </a>
          <a href="./privacy-policy" className="hover:text-white">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
