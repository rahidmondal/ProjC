"use client";

import { logout } from "@/app/services/auth";
import Button from "@/components/Button";
import ProtectedRoute from "@/components/ProtectedRoute";

const ProfilePage = () => {
  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <ProtectedRoute>
      {(user) => (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-xl mb-4">Profile</h1>
          <div className="text-center">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
          <Button label="Logout" onClick={handleLogout} />
        </div>
      )}
    </ProtectedRoute>
  );
};

export default ProfilePage;
