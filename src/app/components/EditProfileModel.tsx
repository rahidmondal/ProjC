// src/app/components/EditProfileModal.tsx
import React from 'react';
import Image from 'next/image';
import { Upload, X, AlertCircle } from 'lucide-react';
import { getUserImageUrl } from '../services/users';
interface ProfileFormData {
    userId?: string; name: string; email: string; title: string; website: string; github: string;
    linkedin: string; profilePicture: File | null; image?: string | null; skills: string[];
    description: string; skillScore?: string[];
}

interface EditProfileModalProps {
  isOpen: boolean;
  formData: ProfileFormData;
  isSaving: boolean;
  saveError: string | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkillsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen, formData, isSaving, saveError, onClose, onSave,
  onChange, onFileChange, onSkillsChange, onDragOver, onDrop
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 transition-opacity duration-300">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-300 dark:border-gray-600 transform transition-all duration-300 scale-100 opacity-100">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-600">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Edit Profile</h2>
          <button onClick={onClose} aria-label="Close modal"><X className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition" /></button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">Profile Picture</label>
            <div className="flex items-center gap-4 mb-2">
               {/* Image Preview */}
              <Image src={ formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : formData.image ? getUserImageUrl(formData.image).toString() : "/assets/avatar_icon.png" } alt="Profile picture preview" width={64} height={64} className="w-16 h-16 rounded-full object-cover border dark:border-gray-600 bg-gray-200" key={formData.profilePicture?.name || formData.image || 'preview-avatar'} onError={(e) => { e.currentTarget.src = "/assets/avatar_icon.png"; }} />
              {/* Drag/Drop/Browse Area */}
              <div className="flex-grow border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition" onDragOver={onDragOver} onDrop={onDrop}>
                <input type="file" accept="image/png, image/jpeg, image/gif" className="hidden" onChange={onFileChange} id="fileInput"/>
                <label htmlFor="fileInput" className="flex flex-col items-center justify-center gap-1 cursor-pointer"><Upload className="w-8 h-8 text-gray-500 dark:text-gray-400 pointer-events-none" /><span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 pointer-events-none">Drag & drop or <span className="text-purple-600 dark:text-purple-400 font-semibold">browse</span></span></label>
              </div>
            </div>
          </div>
           {/* Text Inputs Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Col 1 */}
              <div className="space-y-4">
                <div><label htmlFor="modal-name" className="block text-sm font-semibold mb-1">Name</label><input id="modal-name" type="text" name="name" value={formData.name} className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 cursor-not-allowed" disabled /></div>
                <div><label htmlFor="modal-email" className="block text-sm font-semibold mb-1">Email</label><input id="modal-email" type="email" name="email" value={formData.email} className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 cursor-not-allowed" disabled /></div>
                <div><label htmlFor="modal-title" className="block text-sm font-semibold mb-1">Title / Role</label><input id="modal-title" type="text" name="title" value={formData.title} onChange={onChange} placeholder="e.g., Frontend Developer" className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500"/></div>
                <div><label htmlFor="modal-website" className="block text-sm font-semibold mb-1">Website URL</label><input id="modal-website" type="url" name="website" value={formData.website} onChange={onChange} placeholder="https://your-portfolio.com" className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500"/></div>
              </div>
              {/* Col 2 */}
              <div className="space-y-4">
                <div><label htmlFor="modal-github" className="block text-sm font-semibold mb-1">GitHub Profile URL</label><input id="modal-github" type="url" name="github" value={formData.github} onChange={onChange} placeholder="https://github.com/your-username" className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500"/></div>
                <div><label htmlFor="modal-linkedin" className="block text-sm font-semibold mb-1">LinkedIn Profile URL</label><input id="modal-linkedin" type="url" name="linkedin" value={formData.linkedin} onChange={onChange} placeholder="https://linkedin.com/in/your-profile" className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500"/></div>
                <div><label htmlFor="modal-skills" className="block text-sm font-semibold mb-1">Skills <span className="text-xs font-normal">(comma-separated)</span></label><input id="modal-skills" type="text" name="skills" value={Array.isArray(formData.skills) ? formData.skills.join(", ") : ""} onChange={onSkillsChange} placeholder="e.g., React, TypeScript, AWS" className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500"/></div>
              </div>
            </div>
          {/* Description */}
          <div className="mt-4"><label htmlFor="modal-description" className="block text-sm font-semibold mb-1">About / Description</label><textarea id="modal-description" name="description" value={formData.description} onChange={onChange} placeholder="Tell us a bit about yourself..." rows={4} className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-500"/></div>
          {/* Info Message */}
          <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-4">* Name and Email are linked to your authentication account.</p>
           {/* Error Message Area */}
           {saveError && (<div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 rounded-md flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" /><p className="text-sm text-red-700 dark:text-red-200">{saveError}</p></div>)}
          {/* Modal Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-gray-600">
            <button type="button" onClick={onClose} className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-400 dark:border-gray-500 rounded-md transition font-medium" disabled={isSaving}>Cancel</button>
            <button type="submit" className={`px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition font-semibold ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};