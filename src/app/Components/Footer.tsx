"use client";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 ">
      <div className="container mx-auto px-20 pt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Logo Column */}
        <div>
          <Image
            src="/Light_logo_projc.png"
            alt="Proj.C Logo"
            width={150}
            height={50}
            priority
          />
        </div>

        {/* Home Column */}
        <div>
          <h3 className="text-white text-2xl font-semibold mb-4">Home</h3>
          <ul className="space-y-2 text-lg">
            <li>
              <a href="#" className="hover:text-purple-400">
                About us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Connect Column */}
        <div>
          <h3 className="text-white text-2xl font-semibold mb-4">Connect</h3>
          <ul className="space-y-2 text-lg">
            <li>
              <a href="#" className="hover:text-purple-400">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-purple-400">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us Column */}
        <div>
          <h3 className="text-white text-2xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-lg">
            <li> abc@gmail.com</li>
            <li> +91 88888 88888</li>
            <li> Eloitte Eve, Parkville 3052, Melbourne Canada</li>
          </ul>
        </div>

        {/* Feedback Column */}
        <div>
          <h3 className="text-white text-2xl font-semibold mb-4">
            Please give feedback
          </h3>
          <form>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-3 py-2 mb-3 bg-gray-800 border border-gray-700 text-gray-300 rounded"
            />
            <textarea
              placeholder="Your suggestion"
              className="w-full px-3 py-2 mb-3 bg-gray-800 border border-gray-700 text-gray-300 rounded"
            />
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-800 flex items-center justify-between mt-5  pt-6 px-8 text-center text-gray-300">
        <p className=" pb-6">© 2025 Proj.C. All rights reserved.</p>
        <div className=" flex justify-center items-center pb-6 space-x-6">
          <a href="#" className="hover:text-white">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
