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
  Award,
  AlertCircle
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
import ProfileLink from "./ProfileLink";

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
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  // State for managing the form data
  const [formData, setFormData] = useState<ProfileFormData>({
    userId: "", name: "", email: "", title: "", website: "", github: "",
    linkedin: "", profilePicture: null, image: null, skills: [],
    description: "", skillScore: [],
  });

  // State for loading indicator during save and error messages
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);



  // Fetch user data when the component mounts or user changes
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authUser = await getCurrentUser();
        if (authUser) {
          setCurrentUser(authUser);
          const profileData = await getUser(authUser.$id);

          if (profileData) {
            setFormData({
              userId: profileData.userId || authUser.$id,
              name: profileData.name || authUser.name || "",
              email: profileData.email || authUser.email || "",
              title: profileData.title || "",
              website: profileData.website || "",
              github: profileData.github || "",
              linkedin: profileData.linkedin || "",
              profilePicture: null,
              image: profileData.image || null,
              skills: Array.isArray(profileData.skills) ? profileData.skills : [],
              description: profileData.description || "",
              skillScore: Array.isArray(profileData.skillScore) ? profileData.skillScore : [],
            });
            setDocumentId(profileData.$id);
          } else {
            setFormData((prevData) => ({
              ...prevData, userId: authUser.$id, name: authUser.name || "",
              email: authUser.email || "", title: "", website: "", github: "",
              linkedin: "", profilePicture: null, image: null, skills: [],
              description: "", skillScore: [],
            }));
            setDocumentId(null);
          }
        } else {
          console.log("User not logged in, redirecting...");
          router.push('/login');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setSaveError("Could not load profile data.");
      }
    };
    fetchUserData();
  }, [router]);

  // Open modal based on URL query parameter
  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [searchParams]);

  // --- Event Handlers ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
    } else if (e.target.files && e.target.files.length > 0) {
      alert("Please select a valid image file (PNG, JPG, GIF).");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
    } else {
      alert("Please drop a valid image file (PNG, JPG, GIF).");
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const skillsArray = value.split(",")
      .map((skill) => skill.trim());
    setFormData((prev) => ({ ...prev, skills: skillsArray }));
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSaveError(null);
    window.history.replaceState(null, "", "/user-profile");
  };

  const handleSave = async () => {
    if (!currentUser) {
      console.error("User not authenticated.");
      setSaveError("Authentication error. Please log in again.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    let uploadedImageId: string | null = formData.image;
    const oldImageId = formData.image;
    let profileUpdateSuccess = false;

    try {
      // 1. Upload new image *first* if selected
      if (formData.profilePicture) {
        console.log("Uploading new profile picture...");
        try {
          const uploadResponse = await uploadUserImage(formData.profilePicture);
          uploadedImageId = uploadResponse.$id;
          console.log(`New image uploaded with ID: ${uploadedImageId}`);
        } catch (uploadError: any) {
          console.error("Error uploading new image:", uploadError);
          const message = uploadError?.message || "Check console for details.";
          setSaveError(`Image Upload Failed: ${message}`);
          setIsSaving(false);
          return;
        }
      }

      // 2. Prepare User Data for Database
      const userDataToSave = {
        userId: formData.userId || currentUser.$id,
        name: formData.name,
        email: formData.email,
        title: formData.title,
        website: formData.website,
        github: formData.github,
        linkedin: formData.linkedin,
        description: formData.description,
        skills: formData.skills.filter(Boolean),
        image: uploadedImageId,
      };

      // 3. Perform Create or Update Database Operation
      let savedProfileData;
      if (documentId) {
        console.log(`Updating profile document ${documentId}...`);
        savedProfileData = await updateUser(documentId, userDataToSave);
        console.log("User profile updated successfully.");
      } else {
        console.log("Creating new user profile document...");
        savedProfileData = await createUser(userDataToSave);
        console.log("User profile created successfully:", savedProfileData);
        setDocumentId(savedProfileData.$id);
      }
      profileUpdateSuccess = true;

      // 4. Delete old image *after* successful profile update
      if (profileUpdateSuccess && formData.profilePicture && oldImageId && oldImageId !== uploadedImageId) {
        console.log(`Attempting to delete previous image: ${oldImageId}`);
        try {
          await deleteUserImage(oldImageId);
          console.log("Previous image deleted successfully.");
        } catch (deleteError: any) {
          console.error("Failed to delete previous image (post-update):", deleteError);
          setSaveError("Profile saved, but couldn't remove the old image file.");
        }
      }

      // 5. Refresh local state *after* successful save
      console.log("Refreshing local state...");
      const latestProfileData = await getUser(currentUser.$id);
      if (latestProfileData) {
        setFormData({
          userId: latestProfileData.userId || currentUser.$id,
          name: latestProfileData.name || "",
          email: latestProfileData.email || currentUser.email || "",
          title: latestProfileData.title || "",
          website: latestProfileData.website || "",
          github: latestProfileData.github || "",
          linkedin: latestProfileData.linkedin || "",
          profilePicture: null,
          image: latestProfileData.image || null,
          skills: Array.isArray(latestProfileData.skills) ? latestProfileData.skills : [],
          description: latestProfileData.description || "",
          skillScore: Array.isArray(latestProfileData.skillScore) ? latestProfileData.skillScore : [],
        });
        if (!documentId && latestProfileData.$id) {
          setDocumentId(latestProfileData.$id);
        }
        console.log("Local state refreshed successfully.");
        closeModal();
      } else {
        console.error("Failed to refetch profile data after save.");
        setSaveError("Profile saved, but failed to refresh display. Please reload the page.");
      }

    } catch (error: any) {
      console.error("Error during save process:", error);
      const message = error?.message || "An unknown error occurred.";
      if (error.code === 400 && error.message.includes('Attribute validation failed')) {
        setSaveError(`Save Failed: Missing required data. Check console.`);
      } else {
        setSaveError(`Save Failed: ${message}`);
      }
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <>
      {/* Main Profile Layout */}
      <div className="my-10 sm:my-14 flex justify-center items-start px-4 dark:text-white">
        <div className="w-full max-w-6xl bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 flex flex-col md:flex-row gap-6 border border-gray-300 dark:border-gray-600 shadow-lg">

          {/* Left Sidebar */}
          <div className="w-full md:w-1/3 bg-white dark:bg-gray-700 shadow-md p-6 rounded-lg border border-gray-300 dark:border-gray-600 flex flex-col items-center flex-shrink-0">
            {/* Profile Image and Basic Info */}
            <div className="flex flex-col items-center text-center w-full">
              <Image src={formData.image ? getUserImageUrl(formData.image).toString() : "/assets/avatar_icon.png"} alt="Profile Picture" width={112} height={112} className="w-28 h-28 rounded-full border-4 border-gray-300 dark:border-gray-500 object-cover mb-4 bg-gray-200" key={formData.image || 'default-avatar'} priority onError={(e) => { console.warn(`Error loading image ID: ${formData.image}. Falling back to default.`); e.currentTarget.src = "/assets/avatar_icon.png"; }} />
              <h2 className="text-xl font-semibold break-words">{formData.name || "User Name"}</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1 break-words">{formData.title || <span className="italic text-sm">No title</span>}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">{formData.email || "No email"}</p>
            </div>
            {/* Edit & Project Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-xs">
              <button className="flex-1 py-2 px-4 border border-gray-400 dark:bg-gray-600 dark:border-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition text-center font-medium" onClick={() => { setSaveError(null); setIsModalOpen(true); }}>Edit Profile</button>
              <Link href="/project-propose" className="flex-1"><button className="w-full py-2 px-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition">+ Propose Project</button></Link>
            </div>
            {/* Social Links */}
            <div className="mt-6 space-y-3 w-full max-w-xs">
              <ProfileLink Icon={Globe} label="Website" link={formData.website} />
              <ProfileLink Icon={Github} label="Github" link={formData.github} />
              <ProfileLink Icon={Linkedin} label="LinkedIn" link={formData.linkedin} />
            </div>
          </div> 
          {/* End Left Sidebar */}

          {/* Edit Profile Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 transition-opacity duration-300">
              <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-300 dark:border-gray-600 transform transition-all duration-300 scale-100 opacity-100">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-600">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Edit Profile</h2>
                  <button onClick={closeModal} aria-label="Close modal"><X className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition" /></button>
                </div>
                {/* Form */}
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Profile Picture</label>
                    <div className="flex items-center gap-4 mb-2">
                      {/* Image Preview */}
                      <Image src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : formData.image ? getUserImageUrl(formData.image).toString() : "/assets/avatar_icon.png"} alt="Profile picture preview" width={64} height={64} className="w-16 h-16 rounded-full object-cover border dark:border-gray-600 bg-gray-200" key={formData.profilePicture?.name || formData.image || 'preview-avatar'} onError={(e) => { e.currentTarget.src = "/assets/avatar_icon.png"; }} />
                      {/* Drag/Drop/Browse Area - **FIX: Removed onClick from this div** */}
                      <div
                        className="flex-grow border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                      // onClick removed - rely on label below
                      >
                        <input type="file" accept="image/png, image/jpeg, image/gif" className="hidden" onChange={handleFileChange} id="fileInput" />
                        {/* Label now solely responsible for triggering input via htmlFor */}
                        <label htmlFor="fileInput" className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400 pointer-events-none" />
                          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 pointer-events-none">Drag & drop or <span className="text-purple-600 dark:text-purple-400 font-semibold">browse</span></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* Text Inputs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Col 1 */}
                    <div className="space-y-4">
                      {/* Name (Disabled) */}
                      <div><label htmlFor="modal-name" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Name</label><input id="modal-name" type="text" name="name" value={formData.name} className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 cursor-not-allowed focus:outline-none" disabled aria-readonly="true" /></div>
                      {/* Email (Disabled) */}
                      <div><label htmlFor="modal-email" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Email</label><input id="modal-email" type="email" name="email" value={formData.email} className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 cursor-not-allowed focus:outline-none" disabled aria-readonly="true" /></div>
                      {/* Title */}
                      <div><label htmlFor="modal-title" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Title / Role</label><input id="modal-title" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Frontend Developer" className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-purple-500" /></div>
                      {/* Website */}
                      <div><label htmlFor="modal-website" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Website URL</label><input id="modal-website" type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://your-portfolio.com" className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-purple-500" /></div>
                    </div>
                    {/* Col 2 */}
                    <div className="space-y-4">
                      {/* GitHub */}
                      <div><label htmlFor="modal-github" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">GitHub Profile URL</label><input id="modal-github" type="url" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/your-username" className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-purple-500" /></div>
                      {/* LinkedIn */}
                      <div><label htmlFor="modal-linkedin" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">LinkedIn Profile URL</label><input id="modal-linkedin" type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/your-profile" className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-purple-500" /></div>
                      {/* Skills (Uses reverted handler) */}
                      <div><label htmlFor="modal-skills" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Skills <span className="text-xs font-normal">(comma-separated)</span></label><input id="modal-skills" type="text" name="skills" value={Array.isArray(formData.skills) ? formData.skills.join(", ") : ""} onChange={handleSkillsChange} placeholder="e.g., React, TypeScript, AWS" className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-purple-500" /></div>
                    </div>
                  </div>
                  {/* Description */}
                  <div className="mt-4"><label htmlFor="modal-description" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">About / Description</label><textarea id="modal-description" name="description" value={formData.description} onChange={handleChange} placeholder="Tell us a bit about yourself..." rows={4} className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-purple-500" /></div>
                  {/* Info Message */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-4">* Name and Email are linked to your authentication account.</p>
                  {/* Error Message Area */}
                  {saveError && (<div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 rounded-md flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" /><p className="text-sm text-red-700 dark:text-red-200">{saveError}</p></div>)}
                  {/* Modal Action Buttons */}
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-gray-600">
                    <button type="button" onClick={closeModal} className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-400 dark:border-gray-500 rounded-md transition font-medium" disabled={isSaving}>Cancel</button>
                    <button type="submit" className={`px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition font-semibold ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
                  </div>
                </form>
              </div>
            </div>
          )} 
          {/* End Modal */}

          {/* Right Section */}
          <div className="w-full md:w-2/3 py-4 px-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
            {/* About Section */}
            <div className="mb-6 pb-4 border-b dark:border-gray-600"><h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">About Me</h3><p className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm sm:text-base leading-relaxed">{formData.description || <span className="italic text-gray-500 dark:text-gray-400">No description provided.</span>}</p></div>
            {/* Skills Section */}
            <div className="mb-6 pb-4 border-b dark:border-gray-600"><h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Skills</h3><div className="flex flex-wrap gap-2">{formData.skills && formData.skills.filter(Boolean).length > 0 ? (formData.skills.filter(Boolean).map((skill: string, index: number) => (<span key={`${skill}-${index}`} className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>))) : (<p className="italic text-gray-500 dark:text-gray-400 text-sm">No skills listed.</p>)}</div></div>
            {/* Skill Scores Section */}
            <div className="mb-6 pb-4 border-b dark:border-gray-600"><div className="flex justify-between items-center mb-3"><h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">Skill Test Scores</h3><Link href="/skill-test"><button className="bg-purple-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition font-medium">Take Skill Test</button></Link></div><div className="space-y-3">{formData.skillScore && formData.skillScore.length > 0 ? (formData.skillScore.map((scoreEntry: string, index: number) => { const parts = scoreEntry.split(':'); if (parts.length === 3 && parts[0] && parts[1] && parts[2]) { const [skill, level, score] = parts; return (<div key={`${skill}-${level}-${index}`} className="flex items-center justify-between bg-gray-50 dark:bg-gray-600 p-3 rounded-lg border border-gray-200 dark:border-gray-500 shadow-sm"><div className="flex items-center overflow-hidden mr-2"><Award className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mr-3 flex-shrink-0" /><div className="flex flex-col sm:flex-row sm:items-baseline gap-x-2"><span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate" title={skill}>{skill}</span><span className="text-xs text-gray-500 dark:text-gray-400">({level})</span></div></div><span className="text-sm font-bold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-700/50 px-2 py-0.5 rounded">Score: {score}</span></div>); } else { return null; } })) : (<p className="italic text-gray-500 dark:text-gray-400 text-sm">No skill test scores recorded yet.</p>)}</div></div>
            {/* Projects Section */}
            <div className="mt-6"><ProjectsSection /></div>
          </div> 
          {/* End Right Section */}

        </div> 
        {/* End Main Content Flex Container */}
      </div> 
      {/* End Page Container */}
    </>
  );
};





export default ProfilePage;