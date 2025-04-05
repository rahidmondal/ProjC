"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "../services/auth";
import { User } from "../types/user";

interface ProtectedRouteProps {
  children: React.ReactNode | ((user: User) => React.ReactNode);
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await getCurrentUser();

      // If accessing /user-profile and not logged in, redirect to /register
      if (!userData && pathname === "/user-profile") {
        router.push("/login");
      }
      // Redirect other protected routes to login
      else if (!userData) {
        router.push(redirectTo);
      } else {
        setUser(userData);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, redirectTo, pathname]);

  if (loading) return <p>Loading...</p>;

  if (!user) return null; // Prevents UI flickering before redirect

  return typeof children === "function" ? (
    <>{children(user)}</>
  ) : (
    <>{children}</>
  );
};

export default ProtectedRoute;
