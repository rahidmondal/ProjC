"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import Button from "@/components/Button";
import { login, getCurrentUser } from "@/app/services/auth";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        router.push("/profile"); // Redirect if already logged in
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (email: string, password: string) => {
    setError(""); // Clear previous errors
    try {
      await login(email, password);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl mb-4">Login</h1>
      <AuthForm type="login" onSubmit={handleLogin} error={error} /> {/* Pass error here */}
      <p className="mt-4">
        Don't have an account?{" "}
        <Button label="Sign Up" onClick={() => router.push("/register")} />
      </p>
    </div>
  );
};

export default LoginPage;
