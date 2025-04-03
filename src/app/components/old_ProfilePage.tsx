"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Globe,
  Github,
  Linkedin,
  Upload,
  FolderOpen,
  X,
} from "lucide-react";

import { getCurrentUser } from "../services/auth";
import {
  createUser,
  getUser,
  updateUser,
  uploadUserImage,
  getUserImageUrl,
  deleteUserImage
} from "../services/users";
import { User } from "../types/user";
import { useSearchParams } from "next/navigation";

const ProfilePage: React.FC = () => {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Store user data
  const [documentId, setDocumentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser(); // Get user from auth.ts
      if (userData) {
        setUser(userData);

        // Fetch user data from the database
        const existingUser = await getUser(userData.$id);
        if (existingUser) {
          setFormData(existingUser);
          setDocumentId(existingUser.$id);
        } else {
          // Initialize form with basic user info from auth
          setFormData({
            userId: userData.$id,
            name: userData.name || "",
            email: userData.email || "",
            title: "",
            website: "",
            github: "",
            linkedin: "",
            profilePicture: null,
            skills: [],
            description: "",
          });
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    title: "",
    website: "",
    github: "",
    linkedin: "",
    profilePicture: null,
    skills: [],
    description: "",
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

  // Handle skills change
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Assuming skills are comma-separated
    const skillsArray = value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({ ...prev, skills: skillsArray }));
  };

  // Save form data

// ...

const handleSave = async () => {
  setIsModalOpen(false);
  window.history.replaceState(null, "", "/user-profile");

  if (!user) {
    console.error("User not logged in.");
    return;
  }

  try {
    let imageId = null;
    // Delete previous image if a new one is being uploaded
    if (formData.profilePicture && formData.image) {
      try {
        await deleteUserImage(formData.image);
        console.log("Previous image deleted successfully.");
      } catch (deleteError) {
        console.error("Error deleting previous image:", deleteError);
        // Handle the error appropriately (e.g., show an error message)
      }
    }

    if (formData.profilePicture) {
      const uploadResponse = await uploadUserImage(formData.profilePicture);
      imageId = uploadResponse.$id;
    } else {
      imageId = formData.image;
    }

    const userData = {
      userId: user.$id,
      name: formData.name,
      email: formData.email,
      title: formData.title,
      website: formData.website,
      github: formData.github,
      linkedin: formData.linkedin,
      description: formData.description,
      skills: formData.skills,
      image: imageId,
    };

    let updatedUser;

    if (documentId) {
      // Update the existing user
      updatedUser = await updateUser(documentId, userData);
      console.log("User updated successfully.");
    } else {
      // Create a new user
      updatedUser = await createUser(userData, imageId);
      console.log("User created successfully.");
      setDocumentId(updatedUser.$id);
    }

    // Fetch the updated user data
    const fetchedUser = await getUser(user.$id);

    if (fetchedUser) {
      // Update local state with the new data
      setFormData(fetchedUser);
      setUser(user);
    }
  } catch (error) {
    console.error("Error saving profile:", error);
  }
};
  return (
    <>
      <div className={`${isModalOpen ? "opacity-50 pointer-events-none" : ""}`}>
        {/* <Navbar /> */}
      </div>
      <div className="my-14 flex justify-center items-center dark:text-white">
        <div className="w-full max-w-6xl bg-[#dfdfdf] dark:bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row gap-6 border border-gray-400 dark:border-gray-600 shadow-lg">
          {/* Left Sidebar - Profile Section */}
          <div className="w-full md:w-1/3 bg-white dark:bg-gray-700 shadow-md p-6 rounded-lg border border-gray-400 dark:border-gray-400">
            <div className="flex flex-col items-center">
              <Image
                src={
                  formData.image
                    ? getUserImageUrl(formData.image)
                    : "/assets/avatar_icon.png"
                }
                alt="Profile"
                width={112}
                height={112}
                className="w-28 h-28 rounded-full border-4 border-gray-300 dark:border-gray-400"
              />
              <h2 className="text-xl font-semibold mt-4">{formData.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{formData.title}</p>
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
                          disabled
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
                          disabled
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
                      {/* Skills */}
                      <div>
                        <label className="text-sm font-semibold">Skills</label>
                        <input
                          type="text"
                          name="skills"
                          value={formData.skills ? formData.skills.join(", ") : ""} 
                          onChange={handleSkillsChange}
                          placeholder="e.g., React, Node.js, JavaScript"
                          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Description */}
                  <div>
                    <label className="text-sm font-semibold">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Write a short bio about yourself"
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </form>

                <p className="text-sm text-gray-500 dark:text-gray-300 italic">
                  Contact Support For Name and Email Change
                </p>
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
              <Link href="/skill-test">
                <button className="bg-purple-600 text-white mt-2 px-4 py-2 rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition">
                  Skill Test
                </button>
              </Link>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {formData.description || "No description provided."}
            </p>

            {/* Skills Section */}
            <h3 className="mt-4 text-xl font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills && formData.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="bg-purple-300 dark:bg-purple-700 px-4 py-1 rounded-full text-sm text-black dark:text-white"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Activity & Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <ProjectsSection />
            </div>
          </div>
        </div>
      </div>
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

const ProjectsSection: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg border border-gray-300 dark:border-gray-600">
    <div className="flex gap-2 text-gray-700">
      <FolderOpen />
      <h3 className="text-lg font-bold mb-2">Projects</h3>
    </div>
    {[
      { name: "Null", color: "gray" },
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