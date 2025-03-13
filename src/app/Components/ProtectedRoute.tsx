"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "../services/auth";

interface ProtectedRouteProps {
  children: React.ReactNode | ((user: any) => React.ReactNode);
  redirectTo?: string; 
}

const ProtectedRoute = ({ children, redirectTo = "/login" }: ProtectedRouteProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await getCurrentUser();
      if (!userData) {
        router.push(redirectTo);
      } else {
        setUser(userData);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, redirectTo]);

  if (loading) return <p>Loading...</p>; 

  if (!user) return null; // Prevents UI flickering before redirect

  return typeof children === "function" ? <>{children(user)}</> : <>{children}</>;
};

export default ProtectedRoute;
