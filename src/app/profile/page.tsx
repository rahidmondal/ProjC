"use client";

import ProtectedRoute from "@/components/ProtectedRoute"; 
import { account } from "../appwrite";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await account.get();
      setUser(userData);
    };

    fetchUser();
  }, []);

  return (
    <ProtectedRoute>
      <div>
        <h1>Profile Page</h1>
        {user && (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
