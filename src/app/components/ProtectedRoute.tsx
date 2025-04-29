"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "../contexts/UserContext";
import { User } from "../types/user";

interface ProtectedRouteProps {
  children: React.ReactNode | ((user: User) => React.ReactNode);
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) => {
  const { authUser, profileUser, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !authUser) {
      if (pathname === "/user-profile") {
        router.push("/login");
      } else {
        router.push(redirectTo);
      }
    }
  }, [authUser, isLoading, router, redirectTo, pathname]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 mb-8 w-full max-w-2xl text-center">
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading...</p>
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-blue-500 dark:bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 mb-8 w-full max-w-2xl text-center">
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">Redirecting to login...</p>
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className="bg-blue-500 dark:bg-blue-600 h-2.5 rounded-full animate-pulse" style={{ width: '90%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return typeof children === "function" ? (
    <>{children(profileUser as User)}</>
  ) : (
    <>{children}</>
  );
};

export default ProtectedRoute;