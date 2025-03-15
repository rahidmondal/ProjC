"use client";

import { logout } from "../services/auth";
import Button from "../Components/Button";
import ProtectedRoute from "../Components/ProtectedRoute";
import Image from "next/image";

const ProfilePage = () => {
  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <ProtectedRoute>
      {(user) => (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 px-6">
          <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
            {/* User Avatar */}
            <div className="flex justify-center">
              <Image
                src={user.avatar || "/assets/web-development-icon.svg"} // Default image
                alt="User Avatar"
                width={150}
                height={150}
                className="rounded-full border-4 border-purple-500 object-cover"
              />
            </div>

            {/* Profile Info */}
            <h1 className="text-2xl font-bold text-purple-700 mt-4">Welcome, {user.name}!</h1>
            <p className="text-gray-600 mt-2">{user.email}</p>

            {/* Logout Button */}
            <div className="mt-6">
              <Button
                label="Logout"
                onClick={handleLogout}
                className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
              />
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default ProfilePage;