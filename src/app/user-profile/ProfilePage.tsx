"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Globe,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Upload,
  FolderOpen,
  NotebookPen,
  X,
} from "lucide-react";
import Navbar from "../Components/Navbar/page";
import Footer from "../Components/Footer";
import { getCurrentUser } from "../services/auth"; // Import function to get user

const ProfilePage: React.FC = () => {
  const [skills] = useState(["React.js", "Tailwind", "Express.js", "MongoDB"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // Store user data

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser(); // Get user from register.tsx
      if (userData) {
        setUser(userData);
      }
    };
    fetchUser();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "Full Stack Developer",
    website: "https://myprashant.tech",
    github: "https://github.com/pkprashantkr",
    linkedin: "https://www.linkedin.com/in/prashant-kumar-ln/",
    instagram: "phobioc_prashant",
    facebook: "phobioc_prashant",
    profilePicture: null,
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, profilePicture: file }));
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setFormData({ ...formData, profilePicture: file });
  };

  // Save form data
  const handleSave = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "User",
        email: user.email || "user@example.com",
      }));
    }
  }, [user]);

  return (
    <>
      <div className={`${isModalOpen ? "opacity-50 pointer-events-none" : ""}`}>
        <Navbar />
      </div>
      <div className="my-14 flex justify-center items-center dark:text-white">
        <div className="w-full max-w-6xl bg-[#dfdfdf] dark:bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row gap-6 border border-gray-400 dark:border-gray-600 shadow-lg">
          {/* Left Sidebar - Profile Section */}
          <div className="w-full md:w-1/3 bg-white dark:bg-gray-700 shadow-md p-6 rounded-lg border border-gray-400 dark:border-gray-400">
            <div className="flex flex-col items-center">
              <img
                src="/assets/avatar_icon.png"
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-gray-300 dark:border-gray-400"
              />
              <h2 className="text-xl font-semibold mt-4">{formData.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {formData.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formData.email}
              </p>
            </div>

            {/* Edit & Project Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                className="w-52 py-2 border border-gray-400 dark:bg-gray-600 dark:border-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                onClick={() => setIsModalOpen(true)}
              >
                Edit
              </button>
              <Link href="/project-propose">
                <button className="w-48 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition">
                  + Project
                </button>
              </Link>
            </div>

            {/* Social Links */}
            <div className="mt-6 space-y-3">
              <ProfileLink
                Icon={Globe}
                label="Website"
                link={formData.website}
              />
              <ProfileLink
                Icon={Github}
                label="Github"
                link={formData.github}
              />
              <ProfileLink
                Icon={Linkedin}
                label="LinkedIn"
                link={formData.linkedin}
              />
              <ProfileLink
                Icon={Instagram}
                label="Instagram"
                link={formData.instagram}
              />
              <ProfileLink
                Icon={Facebook}
                label="Facebook"
                link={formData.facebook}
              />
            </div>
          </div>

          {/* Edit Profile Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
              <div className="w-2/4 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg border border-red-800 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Edit Profile</h2>
                  <button onClick={() => setIsModalOpen(false)}>
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                {/* Form Inputs */}
                <form className="space-y-3">
                  {/* Profile Picture Upload */}
                  <div>
                    <label className="text-sm font-semibold">
                      Profile Picture
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        id="fileInput"
                      />
                      <label
                        htmlFor="fileInput"
                        className="flex flex-col items-center gap-2"
                      >
                        <Upload className="w-10 h-10 text-gray-500 dark:text-gray-300 cursor-pointer" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Drag & drop an image or{" "}
                          <span className="text-purple-600 font-bold cursor-pointer">
                            browse
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-7">
                    <div>
                      {/* Name */}
                      <div>
                        <label className="text-sm font-semibold">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-sm font-semibold">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      {/* Title */}
                      <div>
                        <label className="text-sm font-semibold">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold">Website</label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://example.com"
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <div>
                        <label className="text-sm font-semibold">GitHub</label>
                        <input
                          type="url"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          placeholder="https://github.com/username"
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold">
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold">
                          Instagram
                        </label>
                        <input
                          type="url"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleChange}
                          placeholder="https://instagram.com/username"
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold">
                          Facebook
                        </label>
                        <input
                          type="url"
                          name="facebook"
                          value={formData.facebook}
                          onChange={handleChange}
                          placeholder="https://facebook.com/username"
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </form>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 hover:bg-gray-200 border border-gray-400 dark:bg-gray-600 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Right Section (UNCHANGED) */}
          <div className="w-full md:w-2/3 py-3 px-6 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-400 rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">About</h2>
              <button className="bg-purple-600 text-white mt-2 px-4 py-2 rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition">
                Take Quiz
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              UI/UX Designer, Web Designer
            </p>

            {/* Skills Section */}
            <h3 className="mt-4 text-xl font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-purple-300 dark:bg-purple-700 px-4 py-1 rounded-full text-sm text-black dark:text-white"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Experience Section */}
            <h3 className="mt-6 text-xl font-semibold">Experience</h3>
            <div className="bg-gray-100 dark:bg-gray-600 p-4 rounded-lg mt-2 border border-gray-300 dark:border-gray-600 shadow-sm">
              <h4 className="font-bold">IBM Skillsbuild (Internship)</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Jul 24 - Aug 24
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                diam nonummy nibh.
              </p>
            </div>

            {/* Activity & Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <ActivitySection />
              <ProjectsSection />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const ProfileLink: React.FC<{
  Icon: React.ElementType;
  label: string;
  link: string;
}> = ({ Icon, label, link }) => (
  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-600 p-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
    <div className="flex items-center">
      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-3" />
      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
        {label}
      </span>
    </div>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 dark:text-gray-300 text-sm truncate"
    >
      {link}
    </a>
  </div>
);

const ActivitySection: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700">
    <div className="flex gap-2">
      <NotebookPen />
      <h3 className="text-lg font-bold mb-2"> Activity</h3>
    </div>
    {["Joined new project", "New team member added", "Joined new project"].map(
      (activity, index) => (
        <div
          key={index}
          className="flex items-center space-x-3 py-2 border-b last:border-0"
        >
          <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs">
            Jun 29
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{activity}</p>
        </div>
      )
    )}
  </div>
);

const ProjectsSection: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg border border-gray-300 dark:border-gray-600">
    <div className="flex gap-2 text-gray-700">
      <FolderOpen />
      <h3 className="text-lg font-bold mb-2"> Projects</h3>
    </div>
    {[
      { name: "Food Donation Website", color: "red" },
      { name: "E-commerce Website", color: "green" },
      { name: "AI Trip Planner", color: "blue" },
    ].map((project, index) => (
      <div
        key={index}
        className="flex items-center space-x-3 py-2 border-b last:border-0"
      >
        <div className={`w-3 h-3 rounded-full bg-${project.color}-500`}></div>
        <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
          {project.name}
        </p>
      </div>
    ))}
  </div>
);

export default ProfilePage;
