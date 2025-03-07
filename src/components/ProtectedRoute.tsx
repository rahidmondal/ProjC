"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/services/auth";

const ProtectedRoute = ({ children }: { children: (user: any) => React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await getCurrentUser();
      if (!userData) {
        router.push("/login");
      } else {
        setUser(userData);
      }
    };

    checkAuth();
  }, [router]);

  if (!user) return <p>Loading...</p>;

  return <>{children(user)}</>;
};

export default ProtectedRoute;
