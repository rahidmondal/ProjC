"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Globe,
  Github,
  Linkedin,
  Upload,
  X,
  Award 
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation"; 
import ProjectsSection from "./ProjectSection";
import { getCurrentUser } from "../services/auth";
import {
  createUser,
  getUser, 
  updateUser, 
  uploadUserImage,
  getUserImageUrl,
  deleteUserImage
} from "../services/users";

interface ProfileFormData {
  userId?: string; 
  name: string;
  email: string;
  title: string;
  website: string;
  github: string;
  linkedin: string;
  profilePicture: File | null; 
  image?: string | null; 
  skills: string[];
  description: string;
  skillScore?: string[]; 
}

const ProfilePage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize router
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null); 
  const [documentId, setDocumentId] = useState<string | null>(null);

  // Initialize formData state with type and default values
  const [formData, setFormData] = useState<ProfileFormData>({
    userId: "", // Initialize userId
    name: "",
    email: "",
    title: "",
    website: "",
    github: "",
    linkedin: "",
    profilePicture: null, // File object for upload
    image: null, // String (fileId) from database
    skills: [],
    description: "",
    skillScore: [], // Initialize skillScore array
  });

  // Effect to fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authUser = await getCurrentUser(); // Get user from Appwrite auth
        if (authUser) {
          setCurrentUser(authUser); // Store the auth user info

          // Fetch user profile data from the 'users' database collection using authUser.$id
          const profileData = await getUser(authUser.$id);

          if (profileData) {
            // If profile document exists in DB, populate formData
            setFormData({
              userId: profileData.userId, // Make sure DB stores the auth $id as userId
              name: profileData.name || authUser.name || "", // Use DB name, fallback to auth name
              email: profileData.email || authUser.email || "", // Use DB email, fallback to auth email
              title: profileData.title || "",
              website: profileData.website || "",
              github: profileData.github || "",
              linkedin: profileData.linkedin || "",
              profilePicture: null, // Reset file input on load
              image: profileData.image || null, // Use image fileId from DB
              skills: Array.isArray(profileData.skills) ? profileData.skills.filter(Boolean) : [], // Ensure skills is an array and filter empty strings
              description: profileData.description || "",
              skillScore: Array.isArray(profileData.skillScore) ? profileData.skillScore : [], // Populate skillScore if it exists and is an array
            });
            setDocumentId(profileData.$id); // Set the document ID for updates
          } else {
            // If no profile document in DB, initialize form with basic info from auth
            // This happens when a user logs in for the first time and hasn't saved their profile yet
            setFormData((prevData) => ({ // Use previous data to keep potentially set state
                ...prevData, // Keep skillScore etc. if somehow set before
                userId: authUser.$id, // Set userId for creation
                name: authUser.name || "",
                email: authUser.email || "",
                title: "",
                website: "",
                github: "",
                linkedin: "",
                profilePicture: null,
                image: null, // No image initially
                skills: [],
                description: "",
                skillScore: [], // Initialize skillScore
            }));
            setDocumentId(null); // No document ID yet
          }
        } else {
          // Handle case where user is not logged in
          console.log("User not logged in, redirecting...");
          router.push('/login'); // Redirect to login page
        }
      } catch (error) {
          console.error("Error fetching user data:", error);
          // Optionally show an error message to the user
      }
    };
    fetchUserData();
  }, [router]); // Add router to dependency array for the redirect push

  // Effect to handle opening the modal via URL parameter
  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false); // Close modal if param is removed/not present
    }
  }, [searchParams]); // Re-run if searchParams change

 // --- Event Handlers ---

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, profilePicture: file }));
    // Optionally: Clear existing image ID if a new file is selected?
    setFormData((prev) => ({ ...prev, profilePicture: file, image: file ? null : prev.image }));
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) { // Basic type check
        setFormData((prev) => ({ ...prev, profilePicture: file }));
         // Optionally: Clear existing image ID if a new file is dropped?
        setFormData((prev) => ({ ...prev, profilePicture: file, image: file ? null : prev.image }));
    }
  };

  // Handle skills input change (comma-separated)
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Split by comma, trim whitespace, filter out empty strings
    const skillsArray = value.split(",")
                            .map((skill) => skill.trim())
                            .filter(Boolean);
    setFormData((prev) => ({ ...prev, skills: skillsArray }));
  };

  // Handle closing the modal
  const closeModal = () => {
      setIsModalOpen(false);
      // Remove ?edit=true from URL without reloading
      window.history.replaceState(null, "", "/user-profile");
  }

  // Handle saving the profile data
  const handleSave = async () => {
    if (!currentUser) {
      console.error("User not authenticated. Cannot save profile.");
      // Show error message to user
      return;
    }

    // Close modal optimistically
    closeModal();

    try {
      let uploadedImageId = formData.image; // Start with the existing image ID from state

      // 1. Handle Image Upload/Deletion Logic
      const newProfilePictureFile = formData.profilePicture; // The File object, if selected
      const existingDatabaseImageId = formData.image; // The ID stored in state (from DB)

      if (newProfilePictureFile) {
          // If there's an existing image ID in the DB state AND a new file is staged for upload
          if (existingDatabaseImageId) {
              try {
                  console.log(`Attempting to delete previous image: ${existingDatabaseImageId}`);
                  await deleteUserImage(existingDatabaseImageId);
                  console.log("Previous image deleted successfully.");
                  // Important: Nullify the image ID in state *after* successful deletion
                  // Or rely on the upload response to set the new ID later
              } catch (deleteError) {
                  console.error("Error deleting previous image (it might not exist, or permissions issue):", deleteError);
                  // Decide if this is critical. Often, you can proceed with the upload.
                  // If deletion fails, you might end up with an orphaned file in storage.
              }
          }
          // Upload the new image file
          console.log("Uploading new profile picture...");
          const uploadResponse = await uploadUserImage(newProfilePictureFile);
          uploadedImageId = uploadResponse.$id; // Get the new image ID from the upload response
          console.log(`New image uploaded with ID: ${uploadedImageId}`);
      }
      // If no new file was selected (newProfilePictureFile is null), uploadedImageId remains the value from formData.image

      // 2. Prepare User Data for Database (exclude file object, ensure userId)
      // CRITICAL: Do NOT include skillScore here. It's managed separately by the test screen.
      const userDataToSave = {
        userId: formData.userId || currentUser.$id, // MUST include userId, linking profile doc to auth user
        name: formData.name,
        // email: formData.email, // Avoid updating email here as it's linked to auth
        title: formData.title,
        website: formData.website,
        github: formData.github,
        linkedin: formData.linkedin,
        description: formData.description,
        skills: formData.skills,
        image: uploadedImageId, // Use the potentially new or existing image ID
      };

      let savedProfileData;

      // 3. Perform Create or Update operation in the Database
      if (documentId) {
        // Update existing user profile document
        console.log(`Updating profile document ${documentId}...`);
        savedProfileData = await updateUser(documentId, userDataToSave); // Pass the document ID and data
        console.log("User profile updated successfully.");
      } else {
        // Create new user profile document
        console.log("Creating new user profile document...");
        // Pass the data; the createUser service function should handle generating a unique document ID
        savedProfileData = await createUser(userDataToSave); // Pass data, imageId is now part of userDataToSave
        console.log("User profile created successfully.");
        setDocumentId(savedProfileData.$id); // Store the new document ID locally
      }

      // 4. Refresh local state *after* successful save
      // Refetch the data to ensure UI reflects the saved state accurately, including the image URL
       const latestProfileData = await getUser(currentUser.$id);
       if (latestProfileData) {
           setFormData({
               userId: latestProfileData.userId,
               name: latestProfileData.name || "",
               email: latestProfileData.email || currentUser.email || "", // Re-sync email display
               title: latestProfileData.title || "",
               website: latestProfileData.website || "",
               github: latestProfileData.github || "",
               linkedin: latestProfileData.linkedin || "",
               profilePicture: null, // Reset file input state
               image: latestProfileData.image || null, // Update image ID
               skills: Array.isArray(latestProfileData.skills) ? latestProfileData.skills.filter(Boolean) : [],
               description: latestProfileData.description || "",
               skillScore: Array.isArray(latestProfileData.skillScore) ? latestProfileData.skillScore : [], // Refresh skillScore display
           });
           setDocumentId(latestProfileData.$id); // Ensure documentId is set/correct
           console.log("Local state refreshed with latest profile data from DB.");
       } else {
           console.error("Failed to refetch profile data after save.");
           // Maybe revert formData to pre-save state or show error
       }

    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };


  return (
    <>
      {/* Optional: Navbar placeholder */}
      <div className={`${isModalOpen ? "opacity-50 pointer-events-none" : ""}`}>
        {/* <Navbar /> */}
      </div>

      {/* Main Profile Layout */}
      <div className="my-10 sm:my-14 flex justify-center items-start px-4 dark:text-white">
        <div className="w-full max-w-6xl bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 flex flex-col md:flex-row gap-6 border border-gray-300 dark:border-gray-600 shadow-lg">

          {/* --- Left Sidebar - Profile Section --- */}
          <div className="w-full md:w-1/3 bg-white dark:bg-gray-700 shadow-md p-6 rounded-lg border border-gray-300 dark:border-gray-600 flex flex-col items-center flex-shrink-0">
             {/* Profile Image and Basic Info */}
            <div className="flex flex-col items-center text-center w-full">
              <Image
                // Use formData.image (the fileId string) to get the URL
                src={
                  formData.image
                    ? getUserImageUrl(formData.image).toString() // Get URL from fileId
                    : "/assets/avatar_icon.png" // Default avatar
                }
                alt="Profile Picture"
                width={112}
                height={112}
                className="w-28 h-28 rounded-full border-4 border-gray-300 dark:border-gray-500 object-cover mb-4 bg-gray-200" 
                key={formData.image || 'default-avatar'} 
                unoptimized={true} 
                priority 
                 onError={(e) => {
                     console.warn(`Error loading image ID: ${formData.image}. Falling back to default.`);
                     e.currentTarget.src = "/assets/avatar_icon.png";
                 }}
              />
              <h2 className="text-xl font-semibold break-words">{formData.name || "User Name"}</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1 break-words">{formData.title || <span className="italic text-sm">No title</span>}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">
                {formData.email || "No email"}
              </p>
            </div>

            {/* Edit & Project Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-xs"> 
              <button
                className="flex-1 py-2 px-4 border border-gray-400 dark:bg-gray-600 dark:border-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition text-center font-medium"
                onClick={() => setIsModalOpen(true)}
              >
                Edit Profile
              </button>
              <Link href="/project-propose" className="flex-1">
                <button className="w-full py-2 px-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition">
                  + Propose Project
                </button>
              </Link>
            </div>

            {/* Social Links */}
            <div className="mt-6 space-y-3 w-full max-w-xs"> 
              <ProfileLink Icon={Globe} label="Website" link={formData.website} />
              <ProfileLink Icon={Github} label="Github" link={formData.github} />
              <ProfileLink Icon={Linkedin} label="LinkedIn" link={formData.linkedin} />
            </div>
          </div> 
          
          {/* End Left Sidebar */}

          {/* --- Edit Profile Modal --- */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 transition-opacity duration-300">
               {/* Modal Content Box: Increased width, max height, and scroll */}
              <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-300 dark:border-gray-600 transform transition-all duration-300 scale-100 opacity-100">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-600">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Edit Profile</h2>
                  <button onClick={closeModal} aria-label="Close modal">
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition" />
                  </button>
                </div>

                {/* Form Inputs */}
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}> {/* Handle save on form submit */}

                  {/* Profile Picture Section */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4 mb-2">
                        {/* Image Preview */}
                        <Image
                           src={
                               formData.profilePicture // If a new file is selected in the input, create an object URL for preview
                                   ? URL.createObjectURL(formData.profilePicture)
                                   : formData.image // Otherwise, use the existing image fileId from state to get the display URL
                                   ? getUserImageUrl(formData.image).toString()
                                   : "/assets/avatar_icon.png" // Default if no file selected and no imageId in state
                           }
                           alt="Profile picture preview"
                           width={64}
                           height={64}
                           className="w-16 h-16 rounded-full object-cover border dark:border-gray-600 bg-gray-200"
                            key={formData.profilePicture?.name || formData.image || 'preview-avatar'} // Force re-render on file change or imageId change
                            onError={(e) => { e.currentTarget.src = "/assets/avatar_icon.png"; }} 
                        />
                        {/* Drag and Drop Area / Browse Button */}
                        <div
                          className="flex-grow border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onClick={() => document.getElementById('fileInput')?.click()} // Trigger file input on click
                        >
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/gif" // Be specific about accepted types
                            className="hidden"
                            onChange={handleFileChange}
                            id="fileInput"
                          />
                          <label
                            htmlFor="fileInput"
                            className="flex flex-col items-center justify-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400 pointer-events-none" />
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 pointer-events-none">
                              Drag & drop or{' '}
                              <span className="text-purple-600 dark:text-purple-400 font-semibold">
                                browse
                              </span>
                            </span>
                          </label>
                        </div>
                   </div>
                  </div>

                  {/* Text Inputs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Column 1 */}
                    <div className="space-y-4">
                      {/* Name (Disabled) */}
                      <div>
                        <label htmlFor="modal-name" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Name</label>
                        <input
                          id="modal-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 cursor-not-allowed focus:outline-none"
                          disabled
                          aria-readonly="true"
                        />
                      </div>

                      {/* Email (Disabled) */}
                      <div>
                        <label htmlFor="modal-email" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Email</label>
                        <input
                          id="modal-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 cursor-not-allowed focus:outline-none"
                          disabled
                          aria-readonly="true"
                        />
                      </div>

                       {/* Title */}
                       <div>
                         <label htmlFor="modal-title" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Title / Role</label>
                         <input
                           id="modal-title"
                           type="text"
                           name="title"
                           value={formData.title}
                           onChange={handleChange}
                           placeholder="e.g., Frontend Developer"
                           className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                         />
                       </div>

                         {/* Website */}
                       <div>
                         <label htmlFor="modal-website" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Website URL</label>
                         <input
                           id="modal-website"
                           type="url"
                           name="website"
                           value={formData.website}
                           onChange={handleChange}
                           placeholder="https://your-portfolio.com"
                           className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                         />
                       </div>
                    </div> {/* End Column 1 */}

                    {/* Column 2 */}
                    <div className="space-y-4">
                       {/* GitHub */}
                       <div>
                         <label htmlFor="modal-github" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">GitHub Profile URL</label>
                         <input
                           id="modal-github"
                           type="url"
                           name="github"
                           value={formData.github}
                           onChange={handleChange}
                           placeholder="https://github.com/your-username"
                           className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                         />
                       </div>

                       {/* LinkedIn */}
                       <div>
                         <label htmlFor="modal-linkedin" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">LinkedIn Profile URL</label>
                         <input
                           id="modal-linkedin"
                           type="url"
                           name="linkedin"
                           value={formData.linkedin}
                           onChange={handleChange}
                           placeholder="https://linkedin.com/in/your-profile"
                           className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                         />
                       </div>

                       {/* Skills */}
                       <div>
                         <label htmlFor="modal-skills" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Skills <span className="text-xs font-normal">(comma-separated)</span></label>
                         <input
                           id="modal-skills"
                           type="text"
                           name="skills"
                           value={Array.isArray(formData.skills) ? formData.skills.join(", ") : ""}
                           onChange={handleSkillsChange}
                           placeholder="e.g., React, TypeScript, AWS"
                           className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                         />
                       </div>
                    </div> {/* End Column 2 */}
                  </div> {/* End Grid */}

                  {/* Description (Full Width) */}
                  <div className="mt-4">
                    <label htmlFor="modal-description" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">About / Description</label>
                    <textarea
                      id="modal-description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange} 
                      placeholder="Tell us a bit about yourself, your experience, and interests..."
                      rows={4}
                      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                 {/* Disabled fields info message */}
                 <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-4">
                   * Name and Email are linked to your authentication account. Please contact support if changes are needed.
                 </p>

                 {/* Modal Action Buttons */}
                 <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-gray-600">
                   <button
                     type="button"
                     onClick={closeModal}
                     className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-400 dark:border-gray-500 rounded-md transition font-medium"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit" // Submit form on click
                     className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition font-semibold"
                   >
                     Save Changes
                   </button>
                 </div>
                </form> {/* End of form */}
              </div> {/* End of Modal Content Box */}
            </div> /* End of Modal Backdrop */

          )} {/* End of isModalOpen conditional rendering */}


          {/* --- Right Section (About, Skills, Scores, Projects) --- */}
          <div className="w-full md:w-2/3 py-4 px-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">

            {/* About Section */}
            <div className="mb-6 pb-4 border-b dark:border-gray-600">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">About Me</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm sm:text-base leading-relaxed"> 
                {formData.description || <span className="italic text-gray-500 dark:text-gray-400">No description provided. Click 'Edit Profile' to add one.</span>}
              </p>
            </div>

             {/* Skills Section */}
             <div className="mb-6 pb-4 border-b dark:border-gray-600">
                 <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Skills</h3>
                 <div className="flex flex-wrap gap-2">
                 {formData.skills && formData.skills.length > 0 ? (
                     formData.skills.map((skill: string, index: number) => (
                     <span
                         key={`${skill}-${index}`} // Use skill + index for key
                         className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 px-3 py-1 rounded-full text-sm font-medium"
                     >
                         {skill}
                     </span>
                     ))
                 ) : (
                     <p className="italic text-gray-500 dark:text-gray-400 text-sm">No skills listed. Add them in 'Edit Profile'.</p>
                 )}
                 </div>
             </div>

            {/* Skill Scores Section */}
            <div className="mb-6 pb-4 border-b dark:border-gray-600">
              <div className="flex justify-between items-center mb-3">
                 <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">Skill Test Scores</h3>
                  <Link href="/skill-test">
                    <button className="bg-purple-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition font-medium">
                      Take Skill Test
                    </button>
                  </Link>
              </div>
              <div className="space-y-3"> {/* Increased spacing */}
                {formData.skillScore && formData.skillScore.length > 0 ? (
                  formData.skillScore.map((scoreEntry: string, index: number) => {
                    const parts = scoreEntry.split(':');
                    // Validate format: skill:level:score
                    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
                      const [skill, level, score] = parts;
                      return (
                        <div key={`${skill}-${level}-${index}`} className="flex items-center justify-between bg-gray-50 dark:bg-gray-600 p-3 rounded-lg border border-gray-200 dark:border-gray-500 shadow-sm">
                          <div className="flex items-center overflow-hidden mr-2"> {/* Prevent text overflow */}
                            <Award className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mr-3 flex-shrink-0" />
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-x-2">
                               <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate" title={skill}>{skill}</span>
                               <span className="text-xs text-gray-500 dark:text-gray-400">({level})</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-700/50 px-2 py-0.5 rounded">Score: {score}</span>
                        </div>
                      );
                    } else {
                      console.warn("Invalid skillScore entry format detected:", scoreEntry);
                      return ( 
                          <div key={`invalid-${index}`} className="flex items-center justify-between bg-red-50 dark:bg-red-900/50 p-3 rounded-lg border border-red-200 dark:border-red-700 shadow-sm">
                             <span className="text-xs text-red-700 dark:text-red-300 italic">Invalid score entry format.</span>
                          </div>
                      );
                    }
                  })
                ) : (
                  <p className="italic text-gray-500 dark:text-gray-400 text-sm">No skill test scores recorded yet. Take a test!</p>
                )}
              </div>
            </div>

            {/* Projects Section Placeholder */}
            <div className="mt-6">
              <ProjectsSection />
            </div>

          </div> {/* --- End Right Section --- */}

        </div> {/* --- End Main Content Flex Container --- */}
      </div> {/* --- End Page Container --- */}
    </>
  );
}; 



const ProfileLink: React.FC<{
  Icon: React.ElementType;
  label: string;
  link?: string | null; 
}> = ({ Icon, label, link }) => {
  if (!link) {
    return (
         <div className="flex items-center bg-gray-50 dark:bg-gray-600 p-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm opacity-60">
           <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
           <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
             {label} <span className="italic text-xs">(Not provided)</span>
           </span>
         </div>
    );
  }

  let targetUrl = link;
  let displayLink = link;
  try {
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`; 
    }
     const urlObject = new URL(targetUrl);
     displayLink = urlObject.hostname + urlObject.pathname.replace(/\/$/, '');
     displayLink = displayLink.replace(/^www\./, '');

  } catch (e) {
      console.warn(`Invalid URL format for ${label}: ${link}`);
      return (
          <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/50 p-3 rounded-lg border border-red-300 dark:border-red-700 shadow-sm">
            <div className="flex items-center overflow-hidden mr-2">
              <Icon className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" />
              <span className="text-sm text-red-700 dark:text-red-300 font-medium truncate">
                {label}
              </span>
            </div>
             <span className="text-red-600 dark:text-red-400 text-sm truncate italic" title={link}>Invalid Link</span>
          </div>
      );
  }

  return (
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-600 p-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
        <div className="flex items-center overflow-hidden mr-2">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-3 flex-shrink-0" />
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
            {label}
          </span>
        </div>
        <a
          href={targetUrl} // Use the validated & prefixed URL
          target="_blank"
          rel="noopener noreferrer" // Security best practice for external links
          className="text-purple-600 dark:text-purple-400 hover:underline text-sm truncate ml-2" // Added margin-left
          title={targetUrl} // Show full URL on hover for clarity
        >
          {displayLink} {/* Show cleaned-up link text */}
        </a>
      </div>
  );
};


export default ProfilePage;