"use client";

import { useEffect, useState } from "react";
import { account } from "@/app/appwrite";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
    
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
      } catch (error) {
        console.log("User not logged in. Redirecting...");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  return <>{user && children}</>;
};

export default ProtectedRoute;
