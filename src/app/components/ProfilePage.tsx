"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; 
import { createUser, updateUser, uploadUserImage, deleteUserImage } from "../services/users"; 
import { ProfileSidebar } from "./ProfileSidebar";
import { EditProfileModal } from "./EditProfileModel";
import { ProfileDisplaySection, renderSkillScores, renderSkills } from "./ProfileDisplaySection";
import ProjectsSection from "./ProjectSection";
import { useUser } from "../contexts/UserContext"; 

interface ProfileFormData {
    userId?: string; name: string; email: string; title: string; website: string;
    github: string; linkedin: string; profilePicture: File | null;
    image?: string | null; skills: string[]; description: string; skillScore?: string[];
}

const ProfilePage: React.FC = () => {
  const searchParams = useSearchParams();
  // Removed unused useRouter hook call

  // --- State Management ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Removed unused documentId state
  const [formData, setFormData] = useState<ProfileFormData>({ /* Initial empty state */
    userId: "", name: "", email: "", title: "", website: "", github: "",
    linkedin: "", profilePicture: null, image: null, skills: [],
    description: "", skillScore: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

 
  const { authUser, profileUser, isLoading, refetchUser } = useUser();

  // --- Effects ---

  // Effect to populate formData when profileUser from context is available/changes
  useEffect(() => {
    if (profileUser) {
        setFormData({
            userId: profileUser.userId || authUser?.$id || "",
            name: profileUser.name || "",
            email: profileUser.email || "",
            title: profileUser.title || "",
            website: profileUser.website || "",
            github: profileUser.github || "",
            linkedin: profileUser.linkedin || "",
            profilePicture: null,
            image: profileUser.image || null,
            skills: Array.isArray(profileUser.skills) ? profileUser.skills : [],
            description: profileUser.description || "",
            skillScore: Array.isArray(profileUser.skillScore) ? profileUser.skillScore : [],
        });

    } else if (!isLoading) {
        console.log("Profile user data is null after loading.");
    }
  }, [profileUser, isLoading, authUser]);


  useEffect(() => {
    setIsModalOpen(searchParams.get("edit") === "true");
  }, [searchParams]);

  // --- Event Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null; if (file && file.type.startsWith("image/")) { setFormData((prev) => ({ ...prev, profilePicture: file })); } else if (e.target.files && e.target.files.length > 0) { alert("Please select a valid image file."); }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault(); const file = e.dataTransfer.files[0]; if (file && file.type.startsWith("image/")) { setFormData((prev) => ({ ...prev, profilePicture: file })); } else { alert("Please drop a valid image file."); }
  };
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value; const skillsArray = value.split(",").map((skill) => skill.trim()); setFormData((prev) => ({ ...prev, skills: skillsArray }));
  };
  const closeModal = () => {
      setIsModalOpen(false); setSaveError(null); window.history.replaceState(null, "", "/user-profile");
  };

  // --- Main Save Logic ---
  const handleSave = async () => {
    if (!authUser) {
      console.error("User not authenticated (context).");
      setSaveError("Authentication error. Please log in again.");
      return;
    }

    setIsSaving(true); setSaveError(null);
    let uploadedImageId: string | null = formData.image;
    const oldImageId = formData.image;
    let profileUpdateSuccess = false;

    try {
        // 1. Upload new image
        if (formData.profilePicture) {
            try {
                const uploadResponse = await uploadUserImage(formData.profilePicture);
                uploadedImageId = uploadResponse.$id;
            // Catch block with typed error
            } catch (uploadError: unknown) { // Use unknown or Error
                const message = uploadError instanceof Error ? uploadError.message : "Unknown upload error";
                setSaveError(`Image Upload Failed: ${message}`);
                setIsSaving(false);
                return;
            }
        }

        // 2. Prepare User Data
        const userDataToSave = {
            userId: authUser.$id,
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

        // 3. Create/Update
        const currentDocumentId = profileUser?.id;
        if (currentDocumentId) {
            await updateUser(currentDocumentId, userDataToSave); 
        } else {
            await createUser(userDataToSave); 
        }
        profileUpdateSuccess = true;

        // 4. Delete old image
        if (profileUpdateSuccess && formData.profilePicture && oldImageId && oldImageId !== uploadedImageId) {
            // Catch block with typed error and logging
            try {
                await deleteUserImage(oldImageId);
            } catch (deleteError: unknown) { // Use unknown or Error
                 console.error("Failed to delete previous image (post-update):", deleteError);
                 setSaveError("Profile saved, but couldn't remove old image.");
            }
        }

        // 5. Refresh Context State
        await refetchUser();
        console.log("Context refetched after save.");
        closeModal();

    // Catch block with typed error
    } catch (error: unknown) { 
        console.error("Error during save process:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        // Example of checking specific error types if needed
        // if (error instanceof AppwriteException && error.code === 400) { ... }
        setSaveError(`Save Failed: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Loading State ---
  if (isLoading) {
      return ( <div className="flex justify-center items-center min-h-screen"><p>Loading Profile...</p></div> );
  }



  return (
    <>
      <div className="my-10 sm:my-14 flex justify-center items-start px-4 dark:text-white">
        <div className="w-full max-w-6xl bg-gray-100 dark:bg-gray-800 rounded-lg p-4 sm:p-6 flex flex-col md:flex-row gap-6 border border-gray-300 dark:border-gray-600 shadow-lg">

          {/* Use ProfileSidebar Component */}
          <ProfileSidebar
             formData={formData}
             onEditClick={() => { setSaveError(null); setIsModalOpen(true); }}
          />

          {/* Right Section */}
          <div className="w-full md:w-2/3 py-4 px-6 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
             {/* Use ProfileDisplaySection Components */}
             <ProfileDisplaySection title="About Me">
                 <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm sm:text-base leading-relaxed">
                     {formData.description || <span className="italic text-gray-500 dark:text-gray-400">No description provided.</span>}
                 </p>
             </ProfileDisplaySection>

             <ProfileDisplaySection title="Skills">
                 {renderSkills(formData.skills)}
             </ProfileDisplaySection>

             <ProfileDisplaySection
                 title="Skill Test Scores"
                 actionButton={{ href: "/skill-test", text: "Take Skill Test" }}
             >
                 {renderSkillScores(formData.skillScore)}
             </ProfileDisplaySection>

             
            {/* Projects Section */}
            <div className="flex-1">
                <ProjectsSection />
            </div>

          </div>

        </div>
      </div>

      {/* Use EditProfileModal Component */}
      <EditProfileModal
        isOpen={isModalOpen}
        formData={formData}
        isSaving={isSaving}
        saveError={saveError}
        onClose={closeModal}
        onSave={handleSave}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onSkillsChange={handleSkillsChange}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
    </>
  );
};

export default ProfilePage;